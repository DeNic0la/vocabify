import { Component, OnDestroy } from '@angular/core';
import { LobbyService } from '../services/lobby.service';
import { Lobby, LobbyState } from '../types/lobby';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { ToasterService } from '../../services/toaster.service';
import { Subscription } from 'rxjs';
import { Round } from '../types/round';
import firebase from 'firebase/compat';
import DocumentData = firebase.firestore.DocumentData;
import { AuthService } from '../../auth/auth.service';
import { User } from 'functions/src/types/user';

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
  };
  public user: User | undefined;
  public story: string = '';
  public currentRound: Round | undefined;
  public submissionsViewed: boolean = false;
  private roundsSubscription: Subscription = new Subscription();
  private evaluated: boolean = false;
  private timeLeft: number = -1;

  get isHost() {
    if (this.lobby && this.user) {
      return this.user.uid === this.lobby.hostid;
    }
    return false;
  }

  public get LobbyState(): typeof LobbyState {
    return LobbyState;
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
        const participantSub = this.lobbyService
          .getParticipantsObs(lobby?.id || '')
          .subscribe((participants) => {
            this.lobby.id = lobby?.id || '';
            this.lobby.hostid = lobby?.hostid || '';
            this.lobby.name = lobby?.name || '';
            this.lobby.state = lobby?.state || 0;
            this.lobby.story = lobby?.story || [];
            this.lobby.imgUrl = lobby?.imgUrl || '';
            this.lobby.participants = participants || [];

            this.loadStory();
            this.setGameState(lobby?.state);
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
      });
    this.roundsSubscription.add(sub);
  }

  public loadStory() {
    let sentence: string =
      this.lobby?.story[this.lobby?.story.length - 1].sentence || '';
    if (
      !sentence.endsWith('.') &&
      !sentence.endsWith('!') &&
      !sentence.endsWith('?')
    ) {
      sentence += '. ';
    }
    console.log((this.lobby?.story.length || 0) - 1);
    if ((this.lobby?.story.length || 0) - 1 >= 1) {
      sentence = `...${sentence}`;
    }
    this.story = sentence;
  }

  ngOnDestroy() {
    this.lobbyService.leave(this.lobby?.id || '').then(() => {
      this.roundsSubscription.unsubscribe();
    });
  }

  async submitSentence(sentence: string) {
    this.loading = true;
    this.gameState = LobbyState.EVALUATING;
    if (sentence) {
      await this.gameService
        .submitAnswer(this.lobby?.id || '', sentence)
        .catch((e) => this.toastService.showToast('error', e.error));
    }
    this.gameService.getAllRounds(this.lobby?.id || '').then((rounds) => {
      const sub = rounds.subscribe((roundsData) =>
        this.handleRoundsChange(roundsData)
      );
      this.roundsSubscription.add(sub);
    });
  }

  private handleRoundsChange(data: DocumentData[]) {
    this.currentRound = (data as Round[])[data.length - 1];
    if (((data[data.length - 1] as Round).winner as number) >= 0) {
      this.gameState = LobbyState.EVALUATED;
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
        this.loading = false;
        this.evaluated = true;
        this.gameService.evaluate(this.lobby?.id || '');
      }
    }
  }

  private setGameState(state: LobbyState | undefined) {
    if (state) this.gameState = state;
  }

  public tick(time: number): void {
    this.timeLeft = time;
  }

  showWinner() {
    this.submissionsViewed = true;
  }
}
