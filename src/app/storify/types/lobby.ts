import { Participant } from "./participant";

export interface Lobby {
  id: string;
  hostid: string;
  name: string;
  story: string;
  state: LobbyState;
  participants: Participant[];
}

export enum LobbyState {
  JOINING,
  IN_PROGRESS,
}
