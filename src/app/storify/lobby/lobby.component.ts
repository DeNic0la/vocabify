import { Component, OnInit } from '@angular/core';
import {LobbyService} from "../services/lobby.service";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  constructor(private lobbyService: LobbyService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => console.log(user))
    this.lobbyService.getAllLobbies().then((lobbies) => console.log(lobbies))
  }

}
