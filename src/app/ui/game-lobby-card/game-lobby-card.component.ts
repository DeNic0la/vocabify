import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameLobbyCardColor, GameLobbyCardTitleSize} from "./game-lobby-card.types";

@Component({
  selector: 'app-game-lobby-card',
  templateUrl: './game-lobby-card.component.html',
  styleUrls: ['./game-lobby-card.component.scss']
})
export class GameLobbyCardComponent {
  @Input('title') title: string = '';
  @Input('title-size') titleSize: GameLobbyCardTitleSize = 'large';
  @Input('color') color: GameLobbyCardColor = 'primary';
  @Input('max-players') maxPlayers: number = 0;
  @Input('players') players: number = 0;

  @Output('click') click: EventEmitter<void> = new EventEmitter<void>();

  emitClick(): void {
    this.click.emit();
  }


}
