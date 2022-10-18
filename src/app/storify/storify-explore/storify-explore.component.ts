import { Component } from '@angular/core';
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
export class StorifyExploreComponent {
  public isLoading: boolean = true;
  public isOpen: boolean = false;

  constructor(
    private lobbyService: LobbyService,
    private router: Router,
    private msgService: ToasterService
  ) {
    this.loadLobbies();
  }

  async loadLobbies() {
    const value = await this.lobbyService.getLobbiesToJoin();
    this.transformer(value);
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
    this.lobbies = items.sort(StorifyExploreComponent.sortLobbies);
    this.isLoading = false;
  }

  private static sortLobbies(a: LobbyItem, b: LobbyItem): number {
    return (b.id as unknown as number) - (a.id as unknown as number);
  }

  getJoinLobbyCallback(lobbyId: string, lobbyService: LobbyService) {
    return () => {
      this.isLoading = true;
      lobbyService
        .joinLobby(lobbyId)
        .then(() => (this.isLoading = false))
        .catch(() => {
          this.isLoading = false;
          this.msgService.showToast(
            'error',
            "Unexpected Error: Can't join lobby"
          );
        });
    };
  }

  async refresh() {
    this.isLoading = true;
    await this.loadLobbies();
    this.isLoading = false;
  }

  public lobbies: LobbyItem[] = [];
}
