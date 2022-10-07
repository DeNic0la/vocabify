import { Component, OnInit } from '@angular/core';
import firebase from "firebase/compat/app";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private authService:AuthService) {
    authService.currentUser.subscribe(x => {
    this.isLoggedIn = !(x == undefined || false);
    })
  }

  public isLoggedIn: boolean = false;

  ngOnInit(): void {
  }

  public signOut(){
    firebase.auth().signOut();
    this.isLoggedIn = false;
  }
}
