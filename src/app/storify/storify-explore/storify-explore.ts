import { LobbyCardItem } from '../../ui/card-grid/card-grid.types';
import {
  GameLobbyCardColor,
  GameLobbyCardTitleSize,
} from '../../ui/game-lobby-card/game-lobby-card.types';

export class LobbyItem implements LobbyCardItem {
  color: GameLobbyCardColor;
  description: string;
  imgSrc: string | undefined;
  maxPlayers: number | undefined;
  players: number | undefined;
  title: string;
  titleSize: GameLobbyCardTitleSize;
  callback: Function;
  id: string;

  constructor(
    title: string,
    id: string,
    players: number,
    callback: Function,
    imgUrl: string | undefined
  ) {
    this.color = 'primary';
    this.description = '';
    this.imgSrc = imgUrl ? imgUrl : (this.imgSrc = '');
    this.maxPlayers = 10;
    this.players = players;
    this.title = title;
    this.titleSize = 'small';
    this.callback = callback;
    this.id = id;
  }
}
