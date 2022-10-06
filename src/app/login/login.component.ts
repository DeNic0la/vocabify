import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private authSerivce: AuthService) {  }

  public async login(email: string, password: string) {
    await this.authSerivce.login(email, password);
  }
}
