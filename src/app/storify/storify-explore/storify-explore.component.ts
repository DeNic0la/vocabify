import { Component, OnInit } from '@angular/core';
import { LobbyItem } from './storify-explore';
import { Lobby } from '../types/lobby';
import { LobbyService } from '../services/lobby.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-storify-explore',
  templateUrl: './storify-explore.component.html',
  styleUrls: ['./storify-explore.component.scss'],
})
export class StorifyExploreComponent implements OnInit {
  public isLoading: boolean = true;
  public isOpen: boolean = false;

  constructor(
    private lobbyService: LobbyService,
    private router: Router,
    private msgService: ToasterService
  ) {
    this.loadLobbies();
  }

  ngOnInit(): void {}

  async loadLobbies() {
    await this.lobbyService.getLobbiesToJoin().then((value: Lobby[]) => {
      this.transformer(value);
    });
  }

  createPage() {
    this.isOpen = true;
  }

  transformer(value: Lobby[]) {
    let items: LobbyItem[] = [];
    value.forEach((i) => {
      items.push(
        new LobbyItem(
          i.name,
          i.id,
          i.participants.length,
          this.getJoinLobbyCallback(i.id, this.lobbyService),
          i.imgUrl
        )
      );
    });
    this.Lobbies = items;
    this.isLoading = false;
  }

  getJoinLobbyCallback(lobbyId: string, lobbyService: LobbyService) {
    return () => {
      this.isLoading = true;
      lobbyService
        .joinLobby(lobbyId)
        .then(() => (this.isLoading = false))
        .catch((reason) => {
          this.isLoading = false;
          this.msgService.showToast(
            'error',
            "Unexpected Error: Can't join lobby"
          );
        });
    };
  }

  async refresh(){
    this.isLoading = true;
    await this.loadLobbies();
    this.isLoading = false;
  }

  public Lobbies: LobbyItem[] = [];
}
