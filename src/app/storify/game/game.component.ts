import { Component, OnDestroy } from '@angular/core';
import { LobbyService } from '../services/lobby.service';
import { GameState } from './game.types';
import { Lobby } from '../types/lobby';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../services/game.service';
import { ToasterService } from '../../services/toaster.service';
import { Subscription } from 'rxjs';
import { Round } from '../types/round';
import firebase from 'firebase/compat';
import DocumentData = firebase.firestore.DocumentData;
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnDestroy {
  public loading: boolean = false;
  public gameState: GameState = 'submitting';
  public lobby: Lobby | undefined;
  public story: string = '';
  private roundsSubscription: Subscription | undefined;
  public currentRound: Round | undefined;
  private evaluated: boolean = false;
  private isHost: boolean = false;
  private timeLeft: number = -1;

  constructor(
    private lobbyService: LobbyService,
    private route: ActivatedRoute,
    private gameService: GameService,
    private toastService: ToasterService,
    private authService: AuthService
  ) {
    this.loading = true;
    this.lobbyService
      .getLobby(route.snapshot.paramMap.get('id') || '')
      .then((lobby) => {
        this.lobby = lobby;
        this.loadStory();
        this.loading = false;
        this.authService.currentUser.subscribe((user) => {
          this.isHost = user?.uid === this.lobby?.hostid;
        });
      });
  }

  public loadStory() {
    let story = '';
    this.lobby?.story.forEach((storyPart) => {
      if (
        !storyPart.sentence.endsWith('.') &&
        !storyPart.sentence.endsWith('!') &&
        !storyPart.sentence.endsWith('?')
      ) {
        if (storyPart.uid !== 'ai') {
          storyPart.sentence += '. ';
        } else {
          storyPart.sentence += ' ';
        }
      }
      story += storyPart.sentence;
    });
    this.story = story;
  }

  ngOnDestroy() {
    this.lobbyService.leave(this.lobby?.id || '').then(() => {
      this.roundsSubscription?.unsubscribe();
    });
  }

  async submitSentence(sentence: string) {
    this.loading = true;
    this.gameState = 'evaluating';
    if (sentence) {
      await this.gameService
        .submitAnswer(this.lobby?.id || '', sentence)
        .catch((e) => this.toastService.showToast('error', e.error));
    }
    this.gameService.getAllRounds(this.lobby?.id || '').then((rounds) => {
      this.roundsSubscription = rounds.subscribe((roundsData) =>
        this.handleRoundsChange(roundsData)
      );
    });
  }

  private handleRoundsChange(data: DocumentData[]) {
    this.currentRound = (data as Round[])[data.length - 1];
    if (((data[data.length - 1] as Round).winner as number) >= 0) {
      this.gameState = 'evaluated';
      this.loading = false;
    }
    this.checkForEvaluation();
  }

  private checkForEvaluation(): void {
    const playersAmount = this.lobby?.participants.length;
    const sentencesAmount = this.currentRound?.submittedStories.length;
    if (
      (playersAmount === sentencesAmount || this.timeLeft === 0) &&
      !this.evaluated
    ) {
      if (this.isHost) {
        this.evaluated = true;
        this.gameService.evaluate(this.lobby?.id || '');
      }
    }
  }

  public tick(time: number): void {
    this.timeLeft = time;
  }
}
