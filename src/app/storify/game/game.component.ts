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
  public gameState: GameState = 'evaluated';
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
    let sentence: string = this.lobby?.story[this.lobby?.story.length - 1].sentence || '';
    if (!sentence.endsWith('.') && !sentence.endsWith('!') && !sentence.endsWith('?')) {
      sentence += '. ';
    }
    console.log((this.lobby?.story.length || 0) - 1);
    if ((this.lobby?.story.length || 0) - 1 >= 1) {
      sentence = `...${sentence}`;
    }
    this.story = sentence;
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
    console.log(data[data.length - 1]);
    console.log((data[data.length -1] as Round).winner as number);
    if (((data[data.length -1] as Round).winner as number) >= 0) {
      this.gameState = 'evaluated';
      this.loading = false;
    }
  }
}
