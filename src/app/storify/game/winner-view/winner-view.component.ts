import { Component, Input, OnChanges } from '@angular/core';
import { Round } from '../../types/round';
import { Lobby } from '../../types/lobby';
import { GameService } from '../../services/game.service';
import { LobbyState } from 'functions/src/types/lobby';

@Component({
  selector: 'app-winner-view',
  templateUrl: './winner-view.component.html',
  styleUrls: ['./winner-view.component.scss'],
})
export class WinnerViewComponent implements OnChanges {
  @Input('round') round: Round | undefined;
  @Input('lobby') lobby: Lobby | undefined;

  public winnerName: string = 'test winner';
  public winnerStory: string = 'test story';

  constructor(
    private gameService: GameService,
  ) { }

  ngOnChanges(): void {
    if (this.round && this.lobby) {
      const winnerId =
        this.round.submittedStories[this.round.winner as number].uid;
      this.winnerStory =
        this.round.submittedStories.find((story) => story.uid === winnerId)
          ?.sentence || '';
      this.winnerName =
        this.lobby.participants.find(
          (participant) => participant.uid === winnerId
        )?.username || '';
    }
  }

  public async nextRound() {
    await this.gameService.changeState(this.lobby?.id || '', LobbyState.SUBMITTING);
  }
}
