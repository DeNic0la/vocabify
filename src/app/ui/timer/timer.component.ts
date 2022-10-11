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

  public timeRemaining: number = 0;
  private timeInterval: NodeJS.Timer | null = null;
  private timePercentilePx = 248 / this.totalTime;
  private timerRunning = false;

  ngOnInit() {
    this.timeRemaining = this.totalTime;
  }

  ngOnChanges() {
    if (this.started && !this.timerRunning) {
      this.startTimer();
    }
  }

  private startTimer(): void {
    this.timerRunning = true;
    this.timeInterval = setInterval(() => this.tick(), 1000);
  }

  private tick(): void {
    this.timeRemaining--;
    if (this.timeRemaining === 0) {
      this.stopTimer();
    }
    this.adjustTimeSlider();
    this.tickEvent.emit(this.timeRemaining);
  }

  private stopTimer(): void {
    this.timerRunning = false;
    this.started = false;
    if (this.timeInterval) clearInterval(this.timeInterval);
  }

  private adjustTimeSlider(): void {
    if (this.timeSlider) {
      const timeSliderStyle = this.timeSlider.nativeElement.style;
      timeSliderStyle.height = `${
        this.timePercentilePx * this.timeRemaining
      }px`;
      timeSliderStyle.marginTop = `${
        this.timePercentilePx * (this.totalTime - this.timeRemaining)
      }px`;

      if (this.timeRemaining <= this.totalTime / 2) {
        timeSliderStyle.backgroundColor = '#ffca3a';
      }

      if (this.timeRemaining <= this.totalTime / 10) {
        timeSliderStyle.backgroundColor = '#ff595e';
      }
    }
  }
}
