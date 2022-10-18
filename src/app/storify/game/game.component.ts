import { Component, OnDestroy } from '@angular/core';
import { LobbyService } from '../services/lobby.service';
import { Lobby, LobbyState } from '../types/lobby';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { ToasterService } from '../../services/toaster.service';
import { Subscription } from 'rxjs';
import { Round } from '../types/round';
import firebase from 'firebase/compat';
import { AuthService } from '../../auth/auth.service';
import { User } from 'functions/src/types/user';
import DocumentData = firebase.firestore.DocumentData;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnDestroy {
  public loading: boolean = false;
  public gameState: LobbyState = LobbyState.SUBMITTING;
  lobby: Lobby = {
    id: '',
    participants: [],
    state: 0,
    name: '',
    hostid: '',
    story: [],
    imgUrl: '',
    imgName: '',
  };
  public user: User | undefined;
  public story: string = '';
  public currentRound: Round | undefined;
  public submissionsViewed: boolean = false;
  private roundsSubscription: Subscription = new Subscription();
  private timeLeft: number = -1;
  private isEvaluating: boolean = false;

  get isHost() {
    if (this.lobby && this.user) {
      return this.user.uid === this.lobby.hostid;
    }
    return false;
  }

  public get LobbyState(): typeof LobbyState {
    return LobbyState;
  }

  public get isWaitingForEvaluation() {
    const res = this.currentRound?.submittedStories.filter((obj) => {
      return obj.uid === this.user?.uid && this.currentRound?.winner === -1;
    });
    if (res && res.length !== 0) {
      return true;
    }
    return false;
  }

  constructor(
    private lobbyService: LobbyService,
    private gameService: GameService,
    private toastService: ToasterService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loading = true;
    this.authService.currentUser.subscribe((user) => {
      this.user = user || undefined;
      if (this.user?.uid !== this.lobby.hostid && this.isHost) {
        this.toastService.showToast('success', 'You are now the Host');
      }
    });
    const sub = this.lobbyService
      .getLobbyObs(route.snapshot.paramMap.get('id') || '')
      .subscribe((lobby) => {
        if (lobby) {
          this.loading = false;
          this.lobby.id = lobby?.id || '';
          this.lobby.hostid = lobby?.hostid || '';
          this.lobby.name = lobby?.name || '';
          this.lobby.state = lobby?.state || 0;
          this.lobby.story = lobby?.story || [];
          this.lobby.imgUrl = lobby?.imgUrl || '';
          this.setGameState(lobby?.state);
          this.loadStory();

          if (this.lobby?.state !== LobbyState.JOINING) {
            this.router.navigate(['/storify/play/' + this.lobby?.id]);
          }
        }
      });
    this.roundsSubscription.add(sub);

    const participantSub = this.lobbyService
      .getParticipantsObs(route.snapshot.paramMap.get('id') || '')
      .subscribe((participants) => {
        if (participants) {
          this.lobby.participants = participants || [];
          if (!participants?.some((e) => e.uid === this.user?.uid)) {
            this.router.navigate(['storify/explore']);
          }
        }
      });
    this.roundsSubscription.add(participantSub);

    const roundsSub = this.gameService
      .getAllRounds(route.snapshot.paramMap.get('id') || '')
      .subscribe(async (roundsData) => {
        await this.handleRoundsChange(roundsData);
      });
    this.roundsSubscription.add(roundsSub);
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
          storyPart.sentence += '.';
        } else {
          storyPart.sentence += ' ';
        }
      }
      story += storyPart.sentence + ' ';
    });
    this.story = story;
  }

  ngOnDestroy() {
    this.roundsSubscription.unsubscribe();
    this.lobbyService.leave(this.lobby?.id || '');
  }

  async submitSentence(sentence: string) {
    this.loading = true;
    if (sentence) {
      await this.gameService
        .submitAnswer(this.lobby?.id || '', sentence)
        .catch((e) => this.toastService.showToast('error', e.error));
    }
  }

  private async handleRoundsChange(data: DocumentData[]) {
    this.currentRound = (data as Round[])[data.length - 1];
    await this.checkForEvaluation();
  }

  private async checkForEvaluation() {
    const playersAmount = this.lobby?.participants.length;
    const sentencesAmount = this.currentRound?.submittedStories.length;

    if (playersAmount === sentencesAmount || this.timeLeft === 0) {
      if (this.isHost) {
        if (
          this.currentRound?.winner === -1 &&
          !this.isEvaluating &&
          this.gameState === LobbyState.SUBMITTING
        ) {
          this.isEvaluating = true;
          await this.gameService.evaluate(this.lobby?.id || '');
          this.isEvaluating = false;
        }
      }
    }
  }

  private setGameState(state: LobbyState | undefined) {
    if (state) this.gameState = state;
    if (this.gameState === LobbyState.SUBMITTING)
      this.submissionsViewed = false;
  }

  public tick(time: number): void {
    this.timeLeft = time;
  }

  public showWinner() {
    this.submissionsViewed = true;
  }

  public async showSummary() {
    this.loading = true;
    await this.gameService.changeState(this.lobby.id, LobbyState.RANKING);
    this.loading = false;
  }

  public async nextRound() {
    this.loading = true;
    await this.gameService.changeState(
      this.lobby?.id || '',
      LobbyState.SUBMITTING
    );
    this.loading = false;
  }

  public async endGame() {
    this.loading = true;
    await this.gameService.changeState(this.lobby?.id || '', LobbyState.ENDED);
    this.loading = false;
  }
}
