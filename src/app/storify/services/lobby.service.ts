import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Lobby, LobbyState } from '../types/lobby';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {

  constructor(private fireStore: AngularFirestore) { }

  async getLobby(id: string) {
    const lobby = <Lobby>(await this.fireStore.collection('lobbies').doc(id).ref.get()).data();
    if (!lobby) {
      throw new Error('The lobby does not exist.');
    }
    return lobby;
  }

  async getLobbiesToJoin() {
    let lobbies: Lobby[] = [];
    const firebaseLobbies = (await this.fireStore.collection<Lobby>('lobbies').ref.where('state', '==', LobbyState.JOINING).get()).docs;
    for (let lobby of firebaseLobbies) {
      lobbies.push(lobby.data());
    }
    return lobbies;
  }

  async getAllLobbies() {
    let lobbies: Lobby[] = [];
    const firebaseLobbies = (await this.fireStore.collection<Lobby>('lobbies').ref.get()).docs;
    for (let lobby of firebaseLobbies) {
      lobbies.push(lobby.data());
    }
    return lobbies;
  }
}
