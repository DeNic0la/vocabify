import { Component, OnInit } from '@angular/core';
import { LobbyCardItem } from '../ui/card-grid/card-grid.types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router) {}
  public cards: LobbyCardItem[] = [
    {
      title: 'Storify',
      players: 0,
      maxPlayers: 0,
      imgSrc:
        'https://images.pexels.com/photos/3808904/pexels-photo-3808904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      color: 'primary',
      titleSize: 'large',
      description: 'Storify is a Cool game or something like that',
      callback: () => {
        this.router.navigate(['/game']);
      },
    },
    {
      title: 'Empty',
      players: 0,
      maxPlayers: 0,
      imgSrc: '',
      color: 'primary',
      titleSize: 'large',
      description: 'in Development',
      callback: () => {
        alert('Game not Developed yet');
      },
    },
    {
      title: 'Empty',
      players: 0,
      maxPlayers: 0,
      imgSrc: '',
      color: 'primary',
      titleSize: 'large',
      description: 'in Development',
      callback: () => {
        alert('Game not Developed yet');
      },
    },
    {
      title: 'Empty',
      players: 0,
      maxPlayers: 0,
      imgSrc: '',
      color: 'primary',
      titleSize: 'large',
      description: 'in Development',
      callback: () => {
        alert('Game not Developed yet');
      },
    },
    {
      title: 'Empty',
      players: 0,
      maxPlayers: 0,
      imgSrc: '',
      color: 'primary',
      titleSize: 'large',
      description: 'in Development',
      callback: () => {
        alert('Game not Developed yet');
      },
    },
  ];
}
