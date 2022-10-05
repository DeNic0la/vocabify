import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonSize} from "../button/button.types";
import {DialogColor} from "./dialog.types";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit{
  @Input('open') isOpen: boolean = false;
  @Input('title') title: string = '';
  @Input('action-text') actionText: string = 'X';
  @Input('action-size') actionSize: ButtonSize = 'mini';
  @Input('action') action: Function | undefined = undefined;
  @Input('color') color: DialogColor = 'primary';

  @Output('openChange') openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public initialClose = true;

  ngOnInit() {
    // bit of a hacky trick to not see the initial close-animation on render... I'll replace it whenever I find a better solution
    // (Nicola ich weiss du wetsch scho motze aber machs ned just let it be please)
    setTimeout(() => this.initialClose = false, 500);
  }

  closeDialog() {
    this.isOpen = false;
    this.openChange.emit(this.isOpen);
  }

  buttonColor() {
    console.log(this.color);
    switch (this.color) {
      case 'success':
        return 'success-inverted';
      case 'danger':
        return 'danger-inverted';
      case 'error':
        return 'error-inverted';
      default:
        return 'inverted';
    }
  }
}
