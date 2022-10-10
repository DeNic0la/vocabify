import { Story } from "./story";

export interface Round {
  createdAt: number;
  winner: number;
  submittedStories: Story[];
}
