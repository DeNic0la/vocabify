import { Story } from './story';

export interface Round {
  createdAt: number;
  winner: number | undefined;
  submittedStories: Story[];
}
