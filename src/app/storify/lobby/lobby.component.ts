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
  lobby: Lobby | undefined;
  user: User | undefined;
  isHost: boolean = false;
  isLeaving: boolean = false;

  private subscriptions: Subscription[] = [];

  get isLoading() {
    return !(this.lobby && this.lobby.id.length > 0) || this.isLeaving;
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
    this.subscriptions.push(
      this.lobbyService
        .getLobbyObs(this.route.snapshot.paramMap.get('id') || '')
        .subscribe({
          next: (value) => {
            this.authService.currentUser.subscribe((user) => {
              if (value && user?.uid === value.hostid) {
                if (!this.isHost) {
                  this.isHost = true;
                  this.toast.showToast(
                    'success',
                    'The Host left, you are now the Host'
                  );
                }
                this.headerService.setAction({
                  prompt: 'Start Game',
                  size: 'large',
                  color: 'success',
                  action: this.start.bind(this),
                });
              }
              this.user = user || undefined;
              const participants = this.lobby?.participants;
              this.lobby = value;
              if (this.lobby && participants)
                this.lobby.participants = participants;
            });
          },
          error: () => {
            this.router.navigate(['not-found']);
          },
        })
    );
    this.subscriptions.push(
      this.lobbyService
        .getParticipantsObs(this.route.snapshot.paramMap.get('id') || '')
        .subscribe({
          next: (val) => {
            if (this.lobby && val) {
              this.lobby.participants = val;
            } else if (val) {
              /* Set Dummy Lobby if the Lobby Object was not fetched yet.*/
              this.lobby = {
                id: '',
                participants: val,
                state: 0,
                name: '',
                hostid: '',
                story: [],
              };
            }
          },
        })
    );
  }

  public removeParticipant(participant: Participant): void {
    // TODO: implement
  }

  public async leave() {
    this.isLeaving = true;
    await this.lobbyService.leave(this.lobby?.id || '');
  }

  public async start() {
    if (this.isHost && this.lobby) {
      try {
        await this.gameService.changeState(
          this.lobby?.id || '',
          LobbyState.IN_PROGRESS
        );
      } catch (e) {
        this.toast.showToast('error', "Game couldn't be started");
      }
      //TODO Redirect to Game
    }
  }

  unsubscribeToAllObservables() {
    this.subscriptions.forEach((value) => {
      value.unsubscribe();
    });
  }

  ngOnDestroy() {
    this.unsubscribeToAllObservables();
    this.lobbyService.leave(this.lobby?.id || '');
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
