import { Component, Input } from '@angular/core';
import { ButtonColor, ButtonSize } from './button.types';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input('size') size: ButtonSize = 'medium';
  @Input('color') color: ButtonColor = 'primary';
}
