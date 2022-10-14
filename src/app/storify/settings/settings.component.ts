import { Component } from '@angular/core';
import { LobbyService } from '../services/lobby.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../services/toaster.service';
import {
  AngularFireStorage,
  AngularFireStorageReference,
} from '@angular/fire/compat/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  public isLoading: boolean = false;
  private filename: string = '';
  public selectedFile: File | undefined;
  public filereader: FileReader = new FileReader();
  ref: AngularFireStorageReference | undefined;
  private static defaultImgUrl: string =
    'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=640&h=443&dpr=1';

  constructor(
    private lobbyService: LobbyService,
    private router: Router,
    private msgService: ToasterService,
    private afStorage: AngularFireStorage
  ) {}

  public previewSrcImage: string = '';

  async createLobby(topic: string) {
    if (topic.length === 0) {
      this.msgService.showToast('error', 'Enter a topic.');
      return;
    }
    this.filename = this.getFileName();
    this.ref = this.afStorage.ref(this.filename);
    if (!this.isLoading) {
      this.isLoading = true;
      if (this.selectedFile) {
        /*UPLOAD FILE*/
        let t = this.ref?.put(this.selectedFile);
        t?.snapshotChanges().subscribe({
          next: (value) => {},
          complete: () => {
            this.ref?.getDownloadURL().subscribe((value) => {
              this.createSeLobby(topic, value, this.filename);
            });
          },
        });
      } else {
        this.createSeLobby(topic, SettingsComponent.defaultImgUrl, '');
      }
    }
  }

  onFileSelect(event: File) {
    this.selectedFile = event;
    /* Do Preview:*/
    this.filereader.readAsDataURL(this.selectedFile);
    this.filereader.onload = (ev) => {
      const r = this.filereader.result;
      if (typeof r === 'string') {
        this.previewSrcImage = r;
      }
    };
  }

  private getFileName(): string {
    return (
      'lobby-images/' +
      (Math.random() + 1).toString(36).substring(7) +
      '_' +
      Date.now().toString()
    );
  }

  createSeLobby(topic: string, imgUrl: string | undefined, filename: string) {
    this.lobbyService
      .createLobby(topic, imgUrl + '', filename)
      .then((value) => {
        this.isLoading = true;
        this.router.navigate(['/storify/lobby/', value]);
      });
  }
}
