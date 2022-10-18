import { Component, Input, OnInit } from '@angular/core';
import { Lobby } from '../../types/lobby';
import { Participant } from '../../types/participant';

@Component({
  selector: 'app-end-view',
  templateUrl: './end-view.component.html',
  styleUrls: ['./end-view.component.scss'],
})
export class EndViewComponent implements OnInit {
  @Input('lobby') lobby: Lobby | undefined;
  @Input('story') story: string = '';

  public participantsSorted: Participant[] = [];

  constructor() {}

  ngOnInit(): void {
    this.participantsSorted =
      this.lobby?.participants.sort((a, b) => b.points - a.points) || [];
  }
}
