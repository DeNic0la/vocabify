import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Lobby} from "../types/lobby";
import {LobbyItem} from "./storify-explore";

@Component({
  selector: 'app-storify-explore',
  templateUrl: './storify-explore.component.html',
  styleUrls: ['./storify-explore.component.scss'],
})
export class StorifyExploreComponent implements OnInit {
  constructor(private fireStore: AngularFirestore) {
    fireStore.collection('lobbies').valueChanges().subscribe(value => {
      console.log(value);
      // @ts-ignore
      this.transformer(value)
    })
  }

  transformer(value:Lobby[]){
    let items:LobbyItem[] = [];
    value.forEach(i => {
      items.push(new LobbyItem(i.name,i.id))
    })
    this.Lobbies = items;
  }

  public Lobbies:LobbyItem[] = [];


  ngOnInit(): void {}
}
