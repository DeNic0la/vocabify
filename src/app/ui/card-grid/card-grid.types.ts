import {
  GameLobbyCardColor,
  GameLobbyCardTitleSize,
} from '../game-lobby-card/game-lobby-card.types';

export interface LobbyCardItem {
  title: string;
  titleSize: GameLobbyCardTitleSize;
  color: GameLobbyCardColor;
  maxPlayers: number | undefined;
  players: number | undefined;
  imgSrc: string | undefined;
  description: string;
  callback: Function;
}
