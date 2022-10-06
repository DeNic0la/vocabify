import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.scss'],
})
export class CardGridComponent implements OnInit {
  constructor() {}

  public test = ['a', 'b', 'c', 'd'];

  ngOnInit(): void {}
}
