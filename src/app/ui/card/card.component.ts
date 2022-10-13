import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import { CardColor, CardSize } from './card.types';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements AfterViewInit {
  @Input('size') size: CardSize = 'small';
  @Input('color') color: CardColor = 'primary';

  @ViewChild('text') text: ElementRef | undefined;

  ngAfterViewInit() {
    const textElement: HTMLElement = this.text?.nativeElement;
    textElement.scrollTop = textElement.scrollHeight;
  }

  constructor() {}
}
