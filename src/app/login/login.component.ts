import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private authSerivce: AuthService) {}

  public isLoading: boolean = false;

  public async login(email: string, password: string) {
    this.isLoading = true;
    await this.authSerivce.login(email, password);
    this.isLoading = false;
  }
}
