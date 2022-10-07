export interface Lobby {
  id: string;
  hostid: string;
  name: string;
  state: LobbyState;
}

export enum LobbyState {
  JOINING,
  IN_PROGRESS,
}
