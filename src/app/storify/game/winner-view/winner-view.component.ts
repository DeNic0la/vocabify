import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Round } from '../../types/round';
import { Lobby } from '../../types/lobby';
import { AuthService } from '../../../auth/auth.service';
import { Winner } from './winner.type';

@Component({
  selector: 'app-winner-view',
  templateUrl: './winner-view.component.html',
  styleUrls: ['./winner-view.component.scss'],
})
export class WinnerViewComponent implements OnChanges {
  @Input('round') round: Round | undefined;
  @Input('lobby') lobby: Lobby | undefined;

  @Output('continue') continueEvent: EventEmitter<void> =
    new EventEmitter<void>();

  public isHost: boolean = false;
  public winner: Winner | undefined;
  public winners: Winner[] = [];
  public showContinue: boolean = false;

  constructor(private auth: AuthService) {
    auth.currentUser.subscribe((x) => {
      if (x?.uid == this.lobby?.hostid) {
        this.isHost = true;
      }
    });
  }

  ngOnChanges(): void {
    if (this.round && this.lobby) {
      const winnerId =
        this.round.submittedStories[this.round.winner as number]?.uid || '';
      if (winnerId) {
        this.winners = [];
        this.winners.push(
          this.getWinnerObj(
            "AI's winner... (+" +
              this.lobby.participants.length * 50 +
              ' Points)',
            winnerId
          )
        );

        let bestStory = this.round.submittedStories[0];
        for (let story of this.round.submittedStories) {
          if (bestStory.userRatings.length < story.userRatings.length) {
            bestStory = story;
          }
        }
        this.winners.push(
          this.getWinnerObj(
            'The audience winner is... (+' +
              this.lobby.participants.length * 25 +
              ' Points)',
            bestStory.uid
          )
        );
      }
    }
    // please ignore this, I'm tired...
    this.winner = this.winners[0];
    setTimeout(() => {
      this.winner = undefined;
      setTimeout(() => {
        this.winner = this.winners[1];
        setTimeout(() => (this.showContinue = true), 3000);
      }, 1000);
    }, 6000);
  }

  private getWinnerObj(title: string, winnerId: string): Winner {
    if (this.lobby && this.round) {
      const winner: Winner = {
        title,
        story:
          this.round.submittedStories.find((story) => story.uid === winnerId)
            ?.sentence || '',
        username:
          this.lobby.participants.find(
            (participant) => participant.uid === winnerId
          )?.username || '',
      };
      return winner;
    }
    return { story: '', title: '', username: '' };
  }

  async continue() {
    this.continueEvent.emit();
  }
}
