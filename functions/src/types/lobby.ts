import { Story } from "./story";

export interface Lobby {
  id: string;
  hostid: string;
  name: string;
  story: Story[];
  state: LobbyState;
}

export enum LobbyState {
  JOINING,
  IN_PROGRESS,
}
