import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TimerService } from 'src/app/storify/services/timer.service';
import { TimerType } from './timer.types';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnChanges {
  @Input('started') started: boolean = false;
  @Input('time') totalTime = 60;
  @Input('type') type: TimerType = 'vertical';

  @Output('tick') tickEvent: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('timeSlider') timeSlider: ElementRef | undefined;

  constructor(public timer: TimerService) { }

  ngOnInit() {
    this.timer.timeRemaining = this.totalTime;
    this.timer.timePercentilePx = 248 / this.totalTime;
    this.timer.interval.subscribe(() => {
      this.adjustTimeSlider();
      if (this.timer.timeRemaining <= 0) this.stopTimer();
    });
  }

  ngOnChanges() {
    if (this.started && !this.timer.timerRunning) {
      this.startTimer();
    }
  }

  private startTimer(): void {
    this.timer.startTimer();
  }

  private stopTimer(): void {
    this.started = false;
    this.timer.stopTimer();
  }

  private adjustTimeSlider(): void {
    if (this.timeSlider) {
      const timeSliderStyle = this.timeSlider.nativeElement.style;
      timeSliderStyle.height = `${this.timer.timePercentilePx * this.timer.timeRemaining
        }px`;
      timeSliderStyle.marginTop = `${this.timer.timePercentilePx * (this.totalTime - this.timer.timeRemaining)
        }px`;

      if (this.timer.timeRemaining <= this.totalTime / 2) {
        timeSliderStyle.backgroundColor = '#ffca3a';
      }

      if (this.timer.timeRemaining <= this.totalTime / 10) {
        timeSliderStyle.backgroundColor = '#ff595e';
      }
    }
  }
}
