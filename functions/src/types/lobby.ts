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
  JOINING,
  SUBMITTING,
  EVALUATING,
  EVALUATED,
  ENDED,
}
