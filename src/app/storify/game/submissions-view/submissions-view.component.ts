import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Round } from '../../types/round';
import { Lobby } from '../../types/lobby';
import { SubmittedStory } from '../game.types';
import { TimerType } from 'src/app/ui/timer/timer.types';
import { GameService } from '../../services/game.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-submissions-view',
  templateUrl: './submissions-view.component.html',
  styleUrls: ['./submissions-view.component.scss'],
})
export class SubmissionsViewComponent implements AfterViewInit {
  @Input('round') round: Round | undefined;
  @Input('lobby') lobby: Lobby | undefined;

  @Output('submissions-viewed') submissionsViewed: EventEmitter<void> =
    new EventEmitter<void>();

  @ViewChild('username') usernameBox: ElementRef | undefined;
  @ViewChild('sentence') sentenceBox: ElementRef | undefined;

  public timerStarted: boolean = false;
  public timerType: TimerType = 'vertical';
  public stories: SubmittedStory[] = [];
  public viewedStories: SubmittedStory[] = [];
  public story: string = '';
  public showingStories: boolean = false;
  public title: string = 'submitted stories';
  public isLoading: boolean = false;

  constructor(private gameService: GameService, private toast: ToasterService) { }

  ngAfterViewInit(): void {
    this.round?.submittedStories.forEach((story) => {
      this.stories.push({
        story: story.sentence,
        username:
          this.lobby?.participants.find(
            (participant) => participant.uid === story.uid
          )?.username || '',
        uid: story.uid,
      });
    });
    this.story = this.lobby?.story[this.lobby?.story.length - 2].sentence || '';
    this.showStories().then(() => {
      this.title = 'which is your favourite?'
      this.timerStarted = true;
    });
  }

  public async vote(storyUid: string) {
    if (this.timerStarted) {
      try {
        this.isLoading = true;
        await this.gameService.rate(this.lobby?.id || '', storyUid);
        this.toast.showToast('success', 'Your vote has been submitted');
        this.isLoading = false;
      } catch (error: any) {
        this.toast.showToast('error', error.message);
      }
    }
  }

  private async showStories(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      this.showingStories = true;
      for (let story of this.stories) {
        await this.showStory(story);
      }
      resolve();
    });
  }

  private showStory(story: SubmittedStory): Promise<void> {
    return new Promise<void>((resolve) => {
      this.viewedStories.unshift(story);
      setTimeout(() => {
        setTimeout(() => {
          resolve();
        }, 600);
      }, 6000);
    });
  }

  checkTime($event: number) {
    if ($event <= 0) this.submissionsViewed.emit();
  }
}
