import { Injectable } from '@angular/core';
import {interval, map, Observable } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private start:number = 60;
  public timeLeft:Observable<number> | undefined;
  private interval: Observable<any> =  interval(1000);

  constructor() { }

  public startTimer(start:number = 60): void {
    this.start = start;
    this.timeLeft =
      this.interval.pipe(map(value => {return this.start - value}))
  }

}
