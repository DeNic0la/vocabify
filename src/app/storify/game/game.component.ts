import {Component, OnDestroy } from '@angular/core';
import {LobbyService} from "../services/lobby.service";
import {GameState} from "./game.types";
import {Lobby} from "../types/lobby";
import {ActivatedRoute} from "@angular/router";
import {GameService} from "../services/game.service";
import {ToasterService} from "../../services/toaster.service";
import {Subscription} from "rxjs";
import {Round} from "../types/round";
import firebase from "firebase/compat";
import DocumentData = firebase.firestore.DocumentData;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnDestroy {
  public loading: boolean = false;
  public gameState: GameState = 'submitting';
  public lobby: Lobby | undefined;
  public story: string = ''
  private roundsSubscribtion: Subscription | undefined;
  public currentRound: Round | undefined;

  constructor(private lobbyService: LobbyService, private route: ActivatedRoute, private gameService: GameService, private toastService: ToasterService) {
    this.loading = true;
    this.lobbyService.getLobby(route.snapshot.paramMap.get('id') || '')
      .then(lobby => {
        this.lobby = lobby;
        this.loadStory();
        this.loading = false;
      })
  }

  public loadStory() {
    this.lobby?.story.forEach(story => {
      let sentence = story.sentence.trim();
      if (!sentence.endsWith('.') && !sentence.endsWith('!') && !sentence.endsWith('?')) {
        sentence += '. ';
      } else sentence += ' ';
      this.story += sentence;
    })
  }

  ngOnDestroy() {
    this.roundsSubscribtion?.unsubscribe();
  }

  submitSentence(sentence: string) {
    this.loading = true;
    this.gameState = "evaluating";
    if (sentence) {
      this.gameService.submitAnswer(this.lobby?.id || '', sentence)
        .then(() => {
          this.gameState = 'evaluated';
          this.loading = false;
          this.gameService.evaluate(this.lobby?.id || '').then(() => {
            this.gameService.getAllRounds(this.lobby?.id || '').then(rounds => {
              this.roundsSubscribtion = rounds.subscribe((roundsData) => this.handleRoundsChange(roundsData))
            })
          })
        })
        .catch(e => this.toastService.showToast('error', e.error))
    }
  }

  private handleRoundsChange(data: DocumentData[]) {
    this.currentRound = (data as Round[])[data.length -1];
  }
}
