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

  public stories: SubmittedStory[] = [];
  public currentStory: SubmittedStory = this.stories[0];
  public story: string = '';
  public showingStories: boolean = false;
  public hidden: boolean = false;

  constructor() {}

  ngAfterViewInit(): void {
    this.round?.submittedStories.forEach((story) => {
      this.stories.push({
        story: story.sentence,
        username:
          this.lobby?.participants.find(
            (participant) => participant.uid === story.uid
          )?.username || '',
      });
    });
    this.story = this.lobby?.story[this.lobby?.story.length - 1].sentence || '';
    this.showStories().then(() => {
      this.submissionsViewed.emit();
    });
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
      this.currentStory = story;
      this.hidden = false;
      setTimeout(() => {
        this.hidden = true;
        setTimeout(() => {
          resolve();
        }, 600);
      }, 6000);
    });
  }
}
