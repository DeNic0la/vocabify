import { Component, OnDestroy, OnInit } from '@angular/core';
import { LobbyService } from '../services/lobby.service';
import { AuthService } from '../../auth/auth.service';
import { Lobby } from '../types/lobby';
import { ActivatedRoute, Router } from '@angular/router';
import { Participant } from '../types/participant';
import { User } from '../../auth/types/User';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit, OnDestroy {
  lobby: Lobby | undefined;
  user: User | undefined;
  isHost: boolean = false;

  constructor(
    private lobbyService: LobbyService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.lobbyService
      .getLobby(this.route.snapshot.paramMap.get('id') || '')
      .then((lobby) => {
        this.authService.currentUser.subscribe((user) => {
          if (user?.uid === lobby.hostid) {
            this.isHost = true;
            this.headerService.setAction({
              prompt: 'Start Game',
              size: 'large',
              color: 'success',
              action: this.start.bind(this),
            });
          }
          this.user = user || undefined;
          this.lobby = lobby;
        });
      })
      .catch(() => this.router.navigate(['not-found']));
  }

  public removeParticipant(participant: Participant): void {
    // TODO: implement
  }

  public async leave() {
    await this.lobbyService.leave(this.lobby?.id || '');
  }

  public async start() {
    await this.lobbyService.start(this.lobby?.id || '');
  }

  ngOnDestroy() {
    this.lobbyService.leave(this.lobby?.id || '');
    this.headerService.setAction(undefined);
  }
}
