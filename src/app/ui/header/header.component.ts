import { Component } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AuthService } from '../../auth/auth.service';
import {HeaderService} from "../../services/header.service";
import {Router} from "@angular/router";
import {ToasterService} from "../../services/toaster.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public isLoggedIn: boolean = false;
  public loading: boolean = false;

  constructor(private authService: AuthService, public headerService: HeaderService, private router: Router, private toasterService: ToasterService) {
    this.loading = true;
    authService.currentUser.subscribe((user) => {
      this.isLoggedIn = !(user == undefined || false);
      this.loading = false;
    });
  }

  public signOut() {
    firebase.auth().signOut().then(() => this.isLoggedIn = false)
      .then(() => this.router.navigate(['home'])
        .then(() => this.toasterService.showToast('success', 'you have been signed out')));
  }
}
