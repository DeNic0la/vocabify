import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Functions } from '../types/functions.enum';
import { LobbyState } from '../types/lobby';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(
    private httpService: HttpService,
    private fireStore: AngularFirestore
  ) {}

  /**
   * Submits the answer
   * @param lobbyId
   * @param sentence
   */
  public async submitAnswer(lobbyId: string, sentence: string) {
    try {
      await this.httpService.post(Functions.SUBMIT, { lobbyId, sentence });
    } catch (error: any) {
      throw new Error(error.error);
    }
  }

  /**
   * Starts a game
   * @param lobbyId
   */
  async changeState(lobbyId: string, state: LobbyState) {
    try {
      await this.httpService.put(Functions.STATE, { lobbyId: lobbyId, state });
    } catch (error: any) {
      throw new Error(error.error);
    }
  }

  /**
   * Evaluates the answers
   * @param lobbyId
   */
  public async evaluate(lobbyId: string) {
    try {
      await this.httpService.put(Functions.EVALUATE, { lobbyId: lobbyId });
    } catch (error: any) {
      throw new Error(error.error);
    }
  }

  public async getAllRounds(lobbyId: string) {
    return this.fireStore
      .collection('lobbies')
      .doc(lobbyId)
      .collection('rounds')
      .valueChanges();
  }
}
