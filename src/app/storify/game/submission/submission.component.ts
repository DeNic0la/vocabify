import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {TimerType} from '../../../ui/timer/timer.types';
import {Lobby} from '../../types/lobby';
import {TextfieldColor} from '../../../ui/textfield/textfield.types';
import {ToasterService} from '../../../services/toaster.service';
import {TimerService} from '../../services/timer.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
})
export class SubmissionComponent implements OnInit, OnDestroy, OnChanges {
  @Input('lobby') lobby: Lobby | undefined;
  @Input('story') story: string = '';

  @Output('submit') submit: EventEmitter<string> = new EventEmitter<string>();
  @Output() zero: EventEmitter<void> = new EventEmitter<void>();

  public timerStarted: boolean = false;
  public timerType: TimerType = 'vertical';
  public sentence: string = '';
  public textareaColor: TextfieldColor = 'inverted';
  public sub: Subscription = new Subscription();

  constructor(
    private toastService: ToasterService,
    private timer: TimerService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['story']){
      console.log("Story Changes: starting Timer");
      this.timer.startTimer(60); // Start Timer
      this.sub.add(
        this.timer.timeLeft?.subscribe({
          next: (val) => {
            if (val <= 0) {
              this.submit.emit(this.sentence);
            }
            if (val < 0) {
              this.zero.emit(); // Host.evaluate with 1 sec delay
            }
          },
        })
      );
    }
  }

  ngOnInit(): void {
    this.handleWindowResize();

    setTimeout(() => (this.timerStarted = true), 1000);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
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
    this.textareaColor = 'inverted';
    this.sentence = this.sentence.replace('\n', ' ');
    if (this.sentence.split(' ').length >= 3) {
      this.submit.emit(this.sentence);
    } else {
      this.textareaColor = 'error';
      this.toastService.showToast(
        'error',
        'You need to write a whole sentence.'
      );
    }
  }

  public onEnter() {
    this.sentence = this.sentence.replace('\n', ' ');
  }
}
