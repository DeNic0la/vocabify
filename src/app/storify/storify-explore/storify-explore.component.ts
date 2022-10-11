import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Lobby } from '../types/lobby';
import { LobbyItem } from './storify-explore';
import { LobbyService } from '../services/lobby.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../services/toaster.service';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';

@Component({
  selector: 'app-storify-explore',
  templateUrl: './storify-explore.component.html',
  styleUrls: ['./storify-explore.component.scss'],
})
export class StorifyExploreComponent implements OnInit {
  private static maxFileSize: number = 5000000;
  public isLoading: boolean = true;
  public isOpen: boolean = false;
  private filename: string = '';
  @ViewChild('fileUpload') input: ElementRef<HTMLInputElement> | undefined;

  constructor(
    private lobbyService: LobbyService,
    private router: Router,
    private msgService: ToasterService,
    private afStorage: AngularFireStorage
  ) {
    lobbyService.getLobbiesToJoin().then((value: Lobby[]) => {
      this.transformer(value);
    });
  }
  ref: AngularFireStorageReference | undefined;
  ngOnInit(): void {}
  createPage() {
    this.isOpen = true;
    this.filename = this.getFileName();
    this.ref = this.afStorage.ref(this.filename);
    console.log(this.filename);
  }

  private getFileName(): string {
    return (
      'lobby-images/' +
      (Math.random() + 1).toString(36).substring(7) +
      '_' +
      Date.now().toString()
    );
  }

  async createLobby(topic: string) {
    let files = this.input?.nativeElement.files;
    let file = files?.item(0);
    if (!this.isLoading) {
      /*UPLOAD FILE*/
      this.isLoading = true;
      if (
        this.input &&
        this.input.nativeElement.files &&
        this.input.nativeElement.files &&
        this.input.nativeElement.files.length > 0
      ) {
        let file = this.input.nativeElement.files.item(0);
        console.log('Has file');
        if (file) {
          console.log('Pow');
          if (
            true /* file.size < StorifyExploreComponent.maxFileSize && file.type.startsWith("image")*/
          ) {
            console.log('Starting Fileupload');
            let t = this.ref?.put(file);

            console.group('Upload');
            t?.snapshotChanges().subscribe({
              next: (value) => {
                console.log(value);
              },
              complete: () => {
                console.groupEnd();
                this.ref?.getDownloadURL().subscribe((value) => {
                  this.createSeLobby(topic, value);
                  console.log(value);
                });
                console.log('POW');
              },
            });
          }
        }
      } else {
        this.createSeLobby(topic, undefined);
      }
    }
  }

  createSeLobby(topic: string, imgUrl: string | undefined) {
    this.lobbyService.createLobby(topic, imgUrl + '').then((value) => {
      this.isLoading = false;
      this.isOpen = false;
      this.router.navigate(['/storify/lobby/', value]);
    });
  }

  transformer(value: Lobby[]) {
    let items: LobbyItem[] = [];
    value.forEach((i) => {
      items.push(
        new LobbyItem(
          i.name,
          i.id,
          i.participants.length,
          this.getJoinLobbyCallback(i.id, this.lobbyService)
        )
      );
    });
    this.Lobbies = items;
    this.isLoading = false;
  }

  getJoinLobbyCallback(lobbyId: string, lobbyService: LobbyService) {
    return () => {
      this.isLoading = true;
      lobbyService
        .joinLobby(lobbyId)
        .then(() => (this.isLoading = false))
        .catch((reason) => {
          this.isLoading = false;
          this.msgService.showToast(
            'error',
            "Unexpected Error: Can't join lobby"
          );
        });
    };
  }

  public Lobbies: LobbyItem[] = [];
}
