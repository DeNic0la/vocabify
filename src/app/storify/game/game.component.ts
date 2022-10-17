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
  public showingSummary: boolean = false;
  private isSubscribed: boolean = false;
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
    });
    const sub = this.lobbyService
      .getLobbyObs(route.snapshot.paramMap.get('id') || '')
      .subscribe((lobby) => {
        if (!this.isSubscribed) {
          this.isSubscribed = true;
          const participantSub = this.lobbyService
            .getParticipantsObs(lobby?.id || '')
            .subscribe((participants) => {
              if (lobby) {
                this.lobby.id = lobby?.id || '';
                this.lobby.hostid = lobby?.hostid || '';
                this.lobby.name = lobby?.name || '';
                this.lobby.state = lobby?.state || 0;
                console.log(this.lobby);
                this.lobby.story = lobby?.story || [];
                this.lobby.imgUrl = lobby?.imgUrl || '';
                this.lobby.participants = participants || [];
                this.gameService
                  .getAllRounds(this.lobby?.id || '')
                  .then((rounds) => {
                    const sub = rounds.subscribe(
                      async (roundsData) =>
                        await this.handleRoundsChange(roundsData)
                    );
                    this.roundsSubscription.add(sub);
                  });
                this.loadStory();
                this.setGameState(lobby?.state);
              }
              this.loading = false;

              if (!participants?.some((e) => e.uid === this.user?.uid)) {
                this.router.navigate(['storify/explore']);
              }

              if (this.lobby?.state !== LobbyState.JOINING) {
                this.router.navigate(['/storify/play/' + this.lobby?.id]);
              }

              if (this.user?.uid !== this.lobby.hostid && this.isHost) {
                this.toastService.showToast('success', 'You are now the Host');
              }
            });
          this.roundsSubscription.add(participantSub);
        }
      });
    this.roundsSubscription.add(sub);
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
        this.loading = false;
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
    localStorage.clear();
    if (state) this.gameState = state;
  }

  public tick(time: number): void {
    this.timeLeft = time;
  }

  public showWinner() {
    this.submissionsViewed = true;
    console.log(this.submissionsViewed);
  }

  public showSummary() {
    this.showingSummary = true;
    this.submissionsViewed = false;
    console.log(this.submissionsViewed);
  }

  public nextRound() {
    this.submissionsViewed = false;
  }
}
