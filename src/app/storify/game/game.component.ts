import { Component, OnInit } from '@angular/core';
import {LobbyService} from "../services/lobby.service";
import {GameState} from "./game.types";
import {Lobby} from "../types/lobby";
import {ActivatedRoute} from "@angular/router";
import {GameService} from "../services/game.service";
import {ToasterService} from "../../services/toaster.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  public loading: boolean = false;
  public gameState: GameState = 'submitting';
  public lobby: Lobby | undefined;
  public story: string = ''

  constructor(private lobbyService: LobbyService, private route: ActivatedRoute, private gameService: GameService, private toastService: ToasterService) {
    this.loading = true;
    this.lobbyService.getLobby(route.snapshot.paramMap.get('id') || '')
      .then(lobby => {
        this.lobby = lobby;
        this.loadStory();
        this.loading = false;
      })
  }

  public loadStory() {
    this.lobby?.story.forEach(story => {
      let sentence = story.sentence.trim();
      if (!sentence.endsWith('.') && !sentence.endsWith('!') && !sentence.endsWith('?')) {
        sentence += '. ';
      } else sentence += ' ';
      this.story += sentence;
    })
  }

  ngOnInit(): void {}

  submitSentence(sentence: string) {
    this.loading = true;
    this.gameState = "evaluating";
    if (sentence) {
      this.gameService.submitAnswer(this.lobby?.id || '', sentence)
        .then(() => {
          console.log(this.lobby);
        })
        .catch(e => this.toastService.showToast('error', e.error))
    }
  }
}
