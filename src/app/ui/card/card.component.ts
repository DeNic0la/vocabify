import {Component, Input } from '@angular/core';
import { CardColor, CardSize } from './card.types';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input('size') size: CardSize = 'small';
  @Input('color') color: CardColor = 'primary';

  constructor() {}

}
