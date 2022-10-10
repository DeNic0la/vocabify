import { Component, Input, OnInit } from '@angular/core';
import { LobbyCardItem } from './card-grid.types';
import {ToasterService} from "../../services/toaster.service";

@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.scss'],
})
export class CardGridComponent implements OnInit {
  constructor(private toaster: ToasterService) {}

  @Input() cards: LobbyCardItem[] = [];
  @Input() title: string = 'Explore';

  onCallback(index: number) {
    this.toaster.showToast('error', 'test')
    //this.cards[index].callback();
  }

  ngOnInit(): void {}
}
