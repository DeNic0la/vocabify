import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { LobbyState } from '../../../../../functions/src/types/lobby';
import { GameService } from '../../services/game.service';
import { Lobby } from '../../types/lobby';
import { Round } from '../../types/round';
import { Participant } from '../../types/participant';

@Component({
  selector: 'app-round-summary',
  templateUrl: './round-summary.component.html',
  styleUrls: ['./round-summary.component.scss'],
})
export class RoundSummaryComponent implements OnInit {
  @Input('lobby') lobby: Lobby | undefined;
  @Input('round') round: Round | undefined;

  @Output('next-round') nextRoundEvent: EventEmitter<void> =
    new EventEmitter<void>();
  @Output('end-game') endGameEvent: EventEmitter<void> =
    new EventEmitter<void>();

  public isHost: boolean = false;
  public participantsSorted: Participant[] = [];

  constructor(private auth: AuthService, private gameService: GameService) {
    auth.currentUser.subscribe((x) => {
      if (x?.uid == this.lobby?.hostid) {
        this.isHost = true;
      }
    });
  }

  ngOnInit() {
    this.participantsSorted =
      this.lobby?.participants.sort((a, b) => b.points - a.points) || [];
  }

  public async nextRound() {
    this.nextRoundEvent.emit();
  }

  public async endGame() {
    this.endGameEvent.emit();
  }
}
