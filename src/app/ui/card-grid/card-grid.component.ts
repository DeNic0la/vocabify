import { Component, Input, OnInit } from '@angular/core';
import { LobbyCardItem } from './card-grid.types';

@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.scss'],
})
export class CardGridComponent implements OnInit {
  constructor() {}

  @Input() Cards: LobbyCardItem[] = [];

  onCallback(index: number) {
    this.Cards[index].callback();
  }

  ngOnInit(): void {}
}
