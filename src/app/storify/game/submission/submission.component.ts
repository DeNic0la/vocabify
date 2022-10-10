import { Component, HostListener, OnInit } from '@angular/core';
import { TimerType } from '../../../ui/timer/timer.types';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
})
export class SubmissionComponent implements OnInit {
  timerStarted: boolean = false;
  timerType: TimerType = 'vertical';

  constructor() {}

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
}
