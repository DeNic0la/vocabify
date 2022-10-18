import { Component } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AuthService } from '../../auth/auth.service';
import { HeaderService } from '../../services/header.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../services/toaster.service';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public isLoggedIn: boolean = false;
  public loading: boolean = false;

  constructor(
    private authService: AuthService,
    public headerService: HeaderService,
    private router: Router,
    private toasterService: ToasterService,
    private sounds: SoundService
  ) {
    this.loading = true;
    authService.currentUser.subscribe((user) => {
      this.isLoggedIn = !(user == undefined || false);
      this.loading = false;
    });
  }

  public signOut() {
    this.sounds.playSound('logout.mp3')
    firebase
      .auth()
      .signOut()
      .then(() => (this.isLoggedIn = false))
      .then(() =>
        this.router
          .navigate(['home'])
          .then(() =>
            this.toasterService.showToast('success', 'you have been signed out')
          )
      );
  }

  public playIconsound() {
    this.sounds.playSound('menuselect.mp3');
  }
}
