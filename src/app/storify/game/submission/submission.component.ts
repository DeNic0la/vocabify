import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TimerType } from '../../../ui/timer/timer.types';
import { Lobby } from '../../types/lobby';
import { TextfieldColor } from '../../../ui/textfield/textfield.types';
import { ToasterService } from '../../../services/toaster.service';
import { TimerService } from '../../services/timer.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
})
export class SubmissionComponent implements OnInit {
  @Input('lobby') lobby: Lobby | undefined;
  @Input('story') story: string = '';

  @Output('submit') submit: EventEmitter<string> = new EventEmitter<string>();
  @Output() zero: EventEmitter<void> = new EventEmitter<void>();

  public timerStarted: boolean = false;
  public timerType: TimerType = 'vertical';
  public sentence: string = '';
  public textareaColor: TextfieldColor = 'inverted';

  constructor(private toastService: ToasterService, private timer: TimerService) { }

  ngOnInit(): void {
    this.handleWindowResize();
    this.timer.startTimer(60); // Start Timer
    this.timer.timeLeft?.subscribe({next: (val)=>{
        if (val <= 0) this.submit.emit(this.sentence);
        if (val < 0) this.zero.emit(); // Host.evaluate with 1 sec delay
      }})
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
    this.textareaColor = 'inverted';
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
}
