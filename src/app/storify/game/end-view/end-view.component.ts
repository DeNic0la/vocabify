import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Lobby } from '../../types/lobby';
import { Participant } from '../../types/participant';
import { LobbyService } from '../../services/lobby.service';

@Component({
  selector: 'app-end-view',
  templateUrl: './end-view.component.html',
  styleUrls: ['./end-view.component.scss'],
})
export class EndViewComponent implements OnInit {
  @Input('lobby') lobby: Lobby | undefined;
  @Input('story') story: string = '';

  @ViewChild('summary') summarySection: ElementRef | undefined;

  public participantsSorted: Participant[] = [];
  public isLoading: boolean = false;

  constructor(private lobbyService: LobbyService) {}

  ngOnInit(): void {
    this.participantsSorted =
      this.lobby?.participants.sort((a, b) => b.points - a.points) || [];
  }

  scrollToSummary() {
    this.summarySection?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  public async goToHome() {
    this.isLoading = true;
    await this.lobbyService.leave(this.lobby?.id || '');
  }
}
