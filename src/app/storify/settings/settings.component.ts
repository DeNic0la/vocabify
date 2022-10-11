import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  private static maxFileSize: number = 5000000;
  public isLoading: boolean = false;
  private filename: string = '';
  ref: AngularFireStorageReference | undefined;
  @ViewChild('fileUpload') input: ElementRef<HTMLInputElement> | undefined;
  private static defaultImgUrl: string =
    'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=640&h=443&dpr=1';

  constructor(
    private lobbyService: LobbyService,
    private router: Router,
    private msgService: ToasterService,
    private afStorage: AngularFireStorage
  ) {}

  async createLobby(topic: string) {
    this.filename = this.getFileName();
    this.ref = this.afStorage.ref(this.filename);
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
        if (file) {
          if (
            true /* file.size < StorifyExploreComponent.maxFileSize && file.type.startsWith("image")*/
          ) {
            let t = this.ref?.put(file);

            t?.snapshotChanges().subscribe({
              next: (value) => {},
              complete: () => {
                this.ref?.getDownloadURL().subscribe((value) => {
                  this.createSeLobby(topic, value);
                });
              },
            });
          }
        }
      } else {
        this.createSeLobby(topic, SettingsComponent.defaultImgUrl);
      }
    }
  }

  private getFileName(): string {
    return (
      'lobby-images/' +
      (Math.random() + 1).toString(36).substring(7) +
      '_' +
      Date.now().toString()
    );
  }

  createSeLobby(topic: string, imgUrl: string | undefined) {
    this.lobbyService.createLobby(topic, imgUrl + '').then((value) => {
      this.isLoading = true;
      this.router.navigate(['/storify/lobby/', value]);
    });
  }
}
