import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Lobby, LobbyState } from '../types/lobby';
import { Participant } from '../types/participant';

@Injectable({
  providedIn: 'root',
})
export class LobbyService {
  constructor(private fireStore: AngularFirestore) {}

  async getLobby(id: string) {
    const lobby = <Lobby>(
      (await this.fireStore.collection('lobbies').doc(id).ref.get()).data()
    );
    if (!lobby) {
      throw new Error('The lobby does not exist.');
    }
    lobby.participants = await this.getAllParticipants(lobby.id);
    return lobby;
  }

  async getLobbiesToJoin() {
    let lobbies: Lobby[] = [];
    const firebaseLobbies = (
      await this.fireStore
        .collection<Lobby>('lobbies')
        .ref.where('state', '==', LobbyState.JOINING)
        .get()
    ).docs;
    for (let firebaseLobby of firebaseLobbies) {
      const lobby: Lobby = {
        id: firebaseLobby.data().id,
        name: firebaseLobby.data().name,
        hostid: firebaseLobby.data().hostid,
        state: firebaseLobby.data().state,
        story: firebaseLobby.data().story,
        participants: await this.getAllParticipants(firebaseLobby.data().id),
      };
      lobbies.push(lobby);
    }
    return lobbies;
  }

  async getAllLobbies() {
    let lobbies: Lobby[] = [];
    const firebaseLobbies = (
      await this.fireStore.collection<Lobby>('lobbies').ref.get()
    ).docs;
    for (let firebaseLobby of firebaseLobbies) {
      const lobby: Lobby = {
        id: firebaseLobby.data().id,
        name: firebaseLobby.data().name,
        hostid: firebaseLobby.data().hostid,
        state: firebaseLobby.data().state,
        story: firebaseLobby.data().story,
        participants: await this.getAllParticipants(firebaseLobby.data().id),
      };
      lobbies.push(lobby);
    }
    return lobbies;
  }

  private async getAllParticipants(lobbyId: string): Promise<Participant[]> {
    let participants: Participant[] = [];
    const firebaseParticipants = (
      await this.fireStore
        .collection('lobbies')
        .doc(lobbyId)
        .collection<Participant>('participants')
        .ref.get()
    ).docs;
    for (let participant of firebaseParticipants) {
      participants.push(participant.data());
    }
    return participants;
  }
}
