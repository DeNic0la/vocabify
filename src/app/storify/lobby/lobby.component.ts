import { Component, OnInit } from '@angular/core';
import {LobbyService} from "../services/lobby.service";
import {AuthService} from "../../auth/auth.service";
import {Lobby} from "../types/lobby";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  lobby: Lobby | undefined;
  isHost: boolean = false;

  constructor(private lobbyService: LobbyService, private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.lobbyService.getLobby(this.route.snapshot.paramMap.get('id') || '')
      .then(lobby => {
        this.authService.currentUser.subscribe(user => {
          if (user?.uid === lobby.hostid) this.isHost = true;
          this.lobby = lobby;
        })
      })
      .catch(() => this.router.navigate(['not-found']))
  }

}
