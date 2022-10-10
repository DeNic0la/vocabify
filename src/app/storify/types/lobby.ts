import { Participant } from './participant';
import { Story } from './story';

export interface Lobby {
  id: string;
  hostid: string;
  name: string;
  story: Story[];
  state: LobbyState;
  participants: Participant[];
}

export enum LobbyState {
  JOINING,
  IN_PROGRESS,
  EVALUATING,
  FINISHED,
}
