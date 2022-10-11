import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TimerType } from '../../../ui/timer/timer.types';
import { Lobby } from '../../types/lobby';
import { TextfieldColor } from '../../../ui/textfield/textfield.types';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
})
export class SubmissionComponent implements OnInit {
  @Input('lobby') lobby: Lobby | undefined;
  @Input('story') story: string = '';

  @Output('submit') submit: EventEmitter<string> = new EventEmitter<string>();
  @Output('tick') tick: EventEmitter<number> = new EventEmitter<number>();

  public timerStarted: boolean = false;
  public timerType: TimerType = 'vertical';
  public sentence: string = '';
  public textareaColor: TextfieldColor = 'inverted';
  private timeLeft: number = -1;

  constructor(private toastService: ToasterService) {}

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
    this.textareaColor = 'inverted';
    if (this.sentence.split(' ').length >= 3 || this.timeLeft === 0) {
      this.submit.emit(this.sentence);
    } else {
      this.textareaColor = 'error';
      this.toastService.showToast(
        'error',
        'You need to write a whole sentence.'
      );
    }
  }

  checkTime(time: number) {
    this.timeLeft = time;
    this.tick.emit(this.timeLeft);
    if (this.timeLeft === 0) this.submitSentence();
  }
}
