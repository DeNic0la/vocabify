import { Injectable } from '@angular/core';
import {interval, Observable, Subscription } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private subscriptions: Subscription = new Subscription();
  public timeRemaining: number = 0;
  public timePercentilePx: number = 0;
  public timerRunning = false;

  public interval: Observable<any> =  interval(1000);

  constructor() { }

  public startTimer(): void {
    const sub = this.interval.subscribe(()=>{
      this.tick();
    })
    this.subscriptions.add(sub);
    this.timerRunning = true;
  }

  public stopTimer(): void {
    this.timerRunning = false;
    this.subscriptions.unsubscribe();
  }

  private tick(): void {
    this.timeRemaining--;

    if (this.timeRemaining === 0) {
      this.stopTimer();
    }
  }
}
