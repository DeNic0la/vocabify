import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { LobbyState } from '../../../../../functions/src/types/lobby';
import { GameService } from '../../services/game.service';
import { Lobby } from '../../types/lobby';
import { Round } from '../../types/round';

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

  isHost: boolean = false;

  constructor(private auth: AuthService, private gameService: GameService) {
    auth.currentUser.subscribe((x) => {
      if (x?.uid == this.lobby?.hostid) {
        this.isHost = true;
      }
    });
  }

  ngOnInit() {
    this.lobby?.participants.forEach((participant) => {
    });
  }

  public async nextRound() {
    await this.gameService.changeState(
      this.lobby?.id || '',
      LobbyState.SUBMITTING
    );
    this.nextRoundEvent.emit();
  }
}
