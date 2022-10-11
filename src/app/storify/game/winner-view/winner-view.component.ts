import {Component, Input, OnInit} from '@angular/core';
import {Round} from "../../types/round";
import {Lobby} from "../../types/lobby";

@Component({
  selector: 'app-winner-view',
  templateUrl: './winner-view.component.html',
  styleUrls: ['./winner-view.component.scss']
})
export class WinnerViewComponent implements OnInit {
  @Input('round') round: Round | undefined;
  @Input('lobby') lobby: Lobby | undefined;

  public winnerName: string = '';

  constructor() { }

  ngOnInit(): void {
    console.log(this.lobby);
    if (this.round && this.lobby) {
      const winnerId = this.round?.submittedStories[this.round?.winner || -1].uid;
      this.winnerName = this.lobby?.participants.find(participant => participant.uid === winnerId)?.username || '';
    }

  }

}
