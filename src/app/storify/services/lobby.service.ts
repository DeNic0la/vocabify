import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Functions } from '../types/functions.enum';
import { Lobby, LobbyState } from '../types/lobby';
import { Participant } from '../types/participant';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class LobbyService {
  constructor(
    private fireStore: AngularFirestore,
    private httpService: HttpService,
    private router: Router
  ) {}

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

  /**
   * Creates a lobby
   * @returns created lobbyId
   */
  async createLobby(): Promise<string> {
    const resp = await this.httpService.post(Functions.CREATE_LOBBY, {});
    return resp.lobbyId;
  }

  /**
   * Leaves a match
   * @param lobbyId
   */
  async leave(lobbyId: string) {
    try {
      await this.httpService.delete(Functions.LEAVE, { lobbyid: lobbyId });
      this.router.navigate(['/storify/explore']);
    } catch (error: any) {
      throw new Error(error.error);
    }
  }
  /**
   * Kicks a user
   * @param lobbyId
   * @param kick_uid
   */
  async kick(lobbyId: string, kick_uid: string) {
    try {
      await this.httpService.delete(Functions.KICK, {
        lobbyid: lobbyId,
        kick_uid,
      });
    } catch (error: any) {
      throw new Error(error.error);
    }
  }

  /**
   * Join to a lobby
   * @param lobbyId
   */
  async joinLobby(lobbyId: string) {
    try {
      await this.httpService.put(Functions.JOIN, { lobbyid: lobbyId });
      this.router.navigate(['/storify/lobby/', lobbyId]);
    } catch (error: any) {
      throw new Error(error.error);
    }
  }

  /**
   * Starts a game
   * @param lobbyId
   */
  async start(lobbyId: string) {
    try {
      this.httpService.put(Functions.START, { lobbyId: lobbyId });
    } catch (error: any) {
      throw new Error(error.error);
    }
  }
}
