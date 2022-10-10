import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import { TimerType } from '../../../ui/timer/timer.types';
import {Lobby} from "../../types/lobby";

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
})
export class SubmissionComponent implements OnInit {
  @Input('lobby') lobby: Lobby | undefined;
  @Input('story') story: string = '';

  @Output('submit') submit: EventEmitter<string> = new EventEmitter<string>();

  timerStarted: boolean = false;
  timerType: TimerType = 'vertical';
  sentence: string = '';


  ngOnInit(): void {
    this.handleWindowResize();
    setTimeout(() => (this.timerStarted = true), 1000);
  }

  @HostListener('window:resize')
  private handleWindowResize() {
    if (document.body.clientWidth <= 800) {
      this.timerType = 'horizontal';
    } else {
      this.timerType = 'vertical';
    }
  }

  public submitSentence(): void {
    this.submit.emit(this.sentence)
  }

  checkTime(time: number) {
    if (time === 0) this.submitSentence();
  }
}
