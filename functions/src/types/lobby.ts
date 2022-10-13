import { Story } from './story';

export interface Lobby {
  id: string;
  hostid: string;
  name: string;
  story: Story[];
  state: LobbyState;
  imgUrl: string | undefined;
}

export enum LobbyState {
  JOINING = 0,
  SUBMITTING = 1,
  EVALUATING = 2,
  EVALUATED = 3,
  ENDED = 4,
}
