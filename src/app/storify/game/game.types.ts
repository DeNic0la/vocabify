export type GameState = 'submitting' | 'evaluating' | 'evaluated' | 'ended';

export interface SubmittedStory {
  username: string,
  story: string
}
