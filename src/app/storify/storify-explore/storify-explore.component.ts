import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Lobby } from '../types/lobby';
import { LobbyItem } from './storify-explore';
import { LobbyService } from '../services/lobby.service';

@Component({
  selector: 'app-storify-explore',
  templateUrl: './storify-explore.component.html',
  styleUrls: ['./storify-explore.component.scss'],
})
export class StorifyExploreComponent implements OnInit {
  constructor(private lobbyService: LobbyService) {
    lobbyService.getLobbiesToJoin().then((value) => {
      this.transformer(value);
    });
  }

  transformer(value: Lobby[]) {
    let items: LobbyItem[] = [];
    value.forEach((i) => {
      items.push(new LobbyItem(i.name, i.id, i.participants.length));
    });
    this.Lobbies = items;
  }

  public Lobbies: LobbyItem[] = [];

  ngOnInit(): void {}
}
