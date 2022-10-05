import {Component, Input} from '@angular/core';
import {IconColor} from "./icon.types";

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  @Input('name') name: string = '';
  @Input('color') color: IconColor = 'black';
}
