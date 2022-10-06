import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-ui-test',
  templateUrl: './ui-test.component.html',
  styleUrls: ['./ui-test.component.scss'],
})
export class UiTestComponent implements OnInit {
  toasterOpen: boolean = false;

  ngOnInit() {
    setTimeout(() => this.toasterOpen = true, 1000)
  }

  open() {
    this.toasterOpen = true;
  }
}
