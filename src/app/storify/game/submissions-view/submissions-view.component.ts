import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import {Round} from '../../types/round';
import {Lobby, LobbyState} from '../../types/lobby';
import {SubmittedStory} from '../game.types';
import {TimerType} from 'src/app/ui/timer/timer.types';
import {GameService} from '../../services/game.service';
import {ToasterService} from 'src/app/services/toaster.service';
import {AuthService} from 'src/app/auth/auth.service';
import {User} from 'functions/src/types/user';
import {TimerService} from '../../services/timer.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-submissions-view',
  templateUrl: './submissions-view.component.html',
  styleUrls: ['./submissions-view.component.scss'],
})
export class SubmissionsViewComponent implements AfterViewInit, OnDestroy {
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
  public user: User = { email: '', uid: '', username: '' };
  public isLoading: boolean = false;
  private sub: Subscription = new Subscription();
  private hasVoted: boolean = false;

  constructor(
    private auth: AuthService,
    private gameService: GameService,
    private toast: ToasterService,
    private timer: TimerService
  ) {
    this.auth.currentUser.subscribe((user) => {
      this.user = user || { email: '', uid: '', username: '' };
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  @HostListener('window:resize')
  private handleWindowResize() {
    if (document.body.clientWidth <= 800) {
      this.timerType = 'horizontal';
    } else {
      this.timerType = 'vertical';
    }
  }

  ngAfterViewInit(): void {
    if (this.lobby?.state !== LobbyState.EVALUATED){
      console.log("Not doing the rating");
      return;
    }
    this.handleWindowResize();
    this.round?.submittedStories.forEach((story) => {
      this.stories.push({
        story: story.sentence,
        username:
          this.lobby?.participants.find(
            (participant) => participant.uid === story.uid
          )?.username || '',
        uid: story.uid,
        userRatings: story.userRatings,
      });
    });
    this.story = this.lobby?.story[this.lobby?.story.length - 2].sentence || '';
    this.showStories().then(() => {
      this.title = 'which is your favourite?';
      console.log("Start a 20 second Timer");
      this.timer.startTimer(20); // Start a 20 s Timer
      this.sub.add(
        this.timer.timeLeft?.subscribe({
          next: (val) => {
            if (val <= 0) {
              this.sub?.unsubscribe();
              this.submissionsViewed.emit();
            }
          },
        })
      );
      this.timerStarted = true;
    });
  }

  public async vote(story: SubmittedStory) {
    if (this.timerStarted && !this.isLoading && !this.hasVoted) {
      try {
        this.isLoading = true;
        this.addVote(story);
        await this.gameService.rate(this.lobby?.id || '', story.uid);
      } catch (error: any) { }
      this.isLoading = false;
    }
  }

  public hasVotedFor(story: SubmittedStory): boolean {
    return (
      (story.userRatings.find((rating) => this.user.uid === rating)?.length ||
        0) > 0
    );
  }

  private addVote(story: SubmittedStory) {
    if (!this.hasVoted) {
      this.hasVoted = true;
      for (let i = 0; i < this.viewedStories.length; i++) {
        if (this.viewedStories[i].uid === story.uid) {
          this.viewedStories[i].userRatings.push(this.user.uid);
        }
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
}
