import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TimerService } from 'src/app/storify/services/timer.service';
import { TimerType } from './timer.types';
import {Subscriber, Subscription} from "rxjs";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnChanges, OnDestroy {
  @Input('started') started: boolean = false;
  @Input('time') totalTime = 60;
  @Input('type') type: TimerType = 'vertical';
  @ViewChild('timeSlider') timeSlider: ElementRef | undefined;

  constructor(public timer: TimerService) { }

  private timePercentilePx:number = 248 / 60;

  private timeRemaining:number = 60;
  private sub:Subscription|undefined;


  ngOnChanges() {
    if (this.started && !this.sub) {
      this.startTimer();
    }
  }

  private startTimer(): void {
    this.sub = this.timer.timeLeft?.subscribe((val) => {
      this.timeRemaining = val;
      this.adjustTimeSlider();
      if (val <= 0) this.stopTimer();
    });
  }

  private stopTimer(): void {
    this.started = false;
    this.sub?.unsubscribe();
    this.sub = undefined;
  }

  private adjustTimeSlider(): void {
    if (this.timeSlider) {
      const timeSliderStyle = this.timeSlider.nativeElement.style;
      timeSliderStyle.height = `${this.timePercentilePx * this.timeRemaining
        }px`;
      timeSliderStyle.marginTop = `${this.timePercentilePx * (this.totalTime - this.timeRemaining)
        }px`;

      if (this.timeRemaining <= this.totalTime / 2) {
        timeSliderStyle.backgroundColor = '#ffca3a';
      }

      if (this.timeRemaining <= this.totalTime / 10) {
        timeSliderStyle.backgroundColor = '#ff595e';
      }
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}
