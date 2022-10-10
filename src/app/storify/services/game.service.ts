import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Functions } from '../types/functions.enum';
import { Participant } from '../types/participant';
import { Round } from '../types/round';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private httpService: HttpService, private fireStore: AngularFirestore,) { }

  public async submitAnswer(lobbyId: string, sentence: string) {
    await this.httpService.post(Functions.SUBMIT, { lobbyId, sentence });
  }

  public async getAllRounds(lobbyId: string) {
    return this.fireStore.collection('lobbies').doc(lobbyId).collection('rounds').valueChanges();
  }
}
