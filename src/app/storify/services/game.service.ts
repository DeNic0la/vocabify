import { Injectable } from '@angular/core';
import { Functions } from '../types/functions.enum';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private httpService: HttpService) {}

  public async submitAnswer(lobbyId: string, sentence: string) {
    await this.httpService.post(Functions.SUBMIT, { lobbyId, sentence });
  }
}
