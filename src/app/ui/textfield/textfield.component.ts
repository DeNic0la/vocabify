import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { TextfieldSize, TextfieldColor } from './textfield.types';

@Component({
  selector: 'app-textfield',
  templateUrl: './textfield.component.html',
  styleUrls: ['./textfield.component.scss'],
})
export class TextfieldComponent {
  @Input('placeholder') placeholder: string = 'Placeholder';
  @Input('value') value: string = '';
  @Input('size') size: TextfieldSize = 'small';
  @Input('color') color: TextfieldColor = 'primary';
  @Input('type') type: string = 'text';

  @ViewChild('textfield') textfield: ElementRef | undefined;

  @Output('valueChange') valueChange: EventEmitter<string> =
    new EventEmitter<string>();

  emitValueChange() {
    this.value = (
      this.textfield?.nativeElement as HTMLInputElement | HTMLTextAreaElement
    ).value;
    this.valueChange.emit(this.value);
  }
}
