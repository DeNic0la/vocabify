import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Lobby } from '../types/lobby';
import { LobbyItem } from './storify-explore';
import { LobbyService } from '../services/lobby.service';
import {Router} from "@angular/router";
import {ButtonColor} from "../../ui/button/button.types";

@Component({
  selector: 'app-storify-explore',
  templateUrl: './storify-explore.component.html',
  styleUrls: ['./storify-explore.component.scss'],
})
export class StorifyExploreComponent implements OnInit {

  public buttonColorDanger:ButtonColor = 'danger';
  public buttonColorSuccess:ButtonColor = 'success'

  public isLoading:boolean = true;
  constructor(private lobbyService: LobbyService,private router:Router) {
    lobbyService.getLobbiesToJoin().then((value:Lobby[]) => {
      this.transformer(value);
    });
  }

  async createLobby(){
    if (!this.isLoading){
      this.isLoading = true;
      this.lobbyService.createLobby().then(value => {
        this.isLoading = false
        this.router.navigate(['/storify/lobby/', value]);
      })
    }

  }

  transformer(value: Lobby[]) {
    let items: LobbyItem[] = [];
    value.forEach((i) => {
      items.push(new LobbyItem(i.name, i.id, i.participants.length,this.getJoinLobbyCallback(i.id,this.lobbyService)));
    });
    this.Lobbies = items;
    this.isLoading = false;
  }

  getJoinLobbyCallback(lobbyId:string,lobbyService:LobbyService){
    return ()=>{
      lobbyService.joinLobby(lobbyId);
    };
  }

  public Lobbies: LobbyItem[] = [];

  ngOnInit(): void {}
}
