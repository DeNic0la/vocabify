import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Round} from "../../types/round";
import {Lobby} from "../../types/lobby";
import {SubmittedStory} from "../game.types";

@Component({
  selector: 'app-submissions-view',
  templateUrl: './submissions-view.component.html',
  styleUrls: ['./submissions-view.component.scss']
})
export class SubmissionsViewComponent implements OnInit {
  @Input('round') round: Round | undefined;
  @Input('lobby') lobby: Lobby | undefined;

  @Output('submissions-viewed') submissionsViewed: EventEmitter<boolean> = new EventEmitter<boolean>()

  public stories: SubmittedStory[] = [
    {username: 'test1', story: 'teststory1'},
    {username: 'test2', story: 'teststory2'}
  ];
  public currentStory: SubmittedStory = this.stories[0]
  public story: string = 'test test testtest test testtest test testtest test testtest test testtest test testtest test testtest test testtest test testtest test testtest test testtest test test'

  constructor() { }

  ngOnInit(): void {
    this.round?.submittedStories.forEach(story => {
      this.stories.push({story: story.sentence, username: this.lobby?.participants.find(participant => participant.uid === story.uid)?.username || ''})
    })
  }

}
