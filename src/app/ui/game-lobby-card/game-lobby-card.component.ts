import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SoundService } from 'src/app/services/sound.service';
import {
  GameLobbyCardColor,
  GameLobbyCardTitleSize,
} from './game-lobby-card.types';

@Component({
  selector: 'app-game-lobby-card',
  templateUrl: './game-lobby-card.component.html',
  styleUrls: ['./game-lobby-card.component.scss'],
})
export class GameLobbyCardComponent {
  @Input('title') title: string = '';
  @Input('title-size') titleSize: GameLobbyCardTitleSize = 'large';
  @Input('color') color: GameLobbyCardColor = 'primary';
  @Input('max-players') maxPlayers: number = 0;
  @Input('players') players: number = 0;
  @Input('img-src') imgSrc: string = '';

  @Output('action') click: EventEmitter<void> = new EventEmitter<void>();

  constructor( private sounds: SoundService) {}

  emitClick(): void {
    this.sounds.playSound('menuselect.mp3');
    this.click.emit();
  }
}
