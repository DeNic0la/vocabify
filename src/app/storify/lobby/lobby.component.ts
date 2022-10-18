import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LobbyService } from '../services/lobby.service';
import { AuthService } from '../../auth/auth.service';
import { Lobby, LobbyState } from '../types/lobby';
import { ActivatedRoute, Router } from '@angular/router';
import { Participant } from '../types/participant';
import { User } from '../../auth/types/User';
import { HeaderService } from '../../services/header.service';
import { ToasterService } from '../../services/toaster.service';
import { Subscription } from 'rxjs';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit, OnDestroy {
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
  user: User | undefined;
  isLeaving: boolean = false;
  isKicking: boolean = false;
  isStarting: boolean = false;
  hostId: string = '';

  private subscriptions: Subscription = new Subscription();

  get isLoading() {
    return (
      !(this.lobby && this.lobby.id.length > 0) ||
      this.isLeaving ||
      this.isStarting
    );
  }

  get isHost() {
    if (this.lobby && this.user) {
      return this.user.uid === this.lobby.hostid;
    }
    return false;
  }

  constructor(
    private lobbyService: LobbyService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private toast: ToasterService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    const userSub = this.authService.currentUser.subscribe((user) => {
      this.user = user || { uid: '', email: '', username: '' };
    });

    const lobbySub = this.lobbyService
      .getLobbyObs(this.route.snapshot.paramMap.get('id') || '')
      .subscribe((lobby) => {
        if (!lobby) {
          this.router.navigate(['/storify/404']);
        }
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

            if (!participants?.some((e) => e.uid === this.user?.uid)) {
              this.router.navigate(['storify/explore']);
            }

            if (this.lobby?.state !== LobbyState.JOINING) {
              this.router.navigate(['/storify/play/' + this.lobby?.id]);
            }

            if (this.hostId !== this.lobby.hostid && this.isHost) {
              this.toast.showToast('success', 'You are now the Host');
            }
            this.hostId = this.lobby.hostid;
            if (this.isHost) {
              this.headerService.setAction({
                prompt: 'Start Game',
                size: 'large',
                color: 'success',
                action: this.start.bind(this),
              });
            }
          });
        this.subscriptions.add(participantSub);
      });

    this.subscriptions.add(userSub);
    this.subscriptions.add(lobbySub);
  }

  public async removeParticipant(participant: Participant) {
    this.isKicking = true;
    await this.lobbyService.kick(this.lobby?.id || '', participant.uid);
    this.isKicking = false;
  }

  public async leave() {
    this.isLeaving = true;
    await this.lobbyService.leave(this.lobby?.id || '');
  }

  public async start() {
    this.isStarting = true;
    if (this.lobby.participants.length >= 3) {
      this.headerService.setAction(undefined);
      if (this.isHost && this.lobby) {
        try {
          await this.gameService.changeState(
            this.lobby?.id || '',
            LobbyState.SUBMITTING
          );
          this.isStarting = false;
        } catch (e: any) {
          this.isStarting = false;
          this.headerService.setAction({
            prompt: 'Start Game',
            size: 'large',
            color: 'success',
            action: this.start.bind(this),
          });
          this.toast.showToast('error', e.message);
        }
      }
    } else {
      this.toast.showToast(
        'error',
        'There are not enough players in the lobby to start the game.'
      );
    }
  }

  unsubscribeToAllObservables() {
    this.subscriptions.unsubscribe();
  }

  ngOnDestroy() {
    this.unsubscribeToAllObservables();
    this.headerService.setAction(undefined);
  }

  @HostListener(
    'window:beforeunload'
  ) /* This doesnt really work like i want it to wark*/
  onWindowClose() {
    this.ngOnDestroy();
    this.router.navigate(['/storify/explore']);
  }
}
