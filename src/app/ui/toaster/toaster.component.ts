import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {ToasterColor} from "./toaster.types";

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnChanges {
  @Input('show') show: boolean = false;
  @Input('color') color: ToasterColor = 'primary';

  @Output('showChange') showChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnChanges() {
    if (this.show) setTimeout(() => {
      this.show = false;
      this.showChange.emit(this.show)
    }, 4000);
  }
}
