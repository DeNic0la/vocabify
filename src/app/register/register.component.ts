import { Component } from '@angular/core';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent{

  constructor(private authServie: AuthService) { }

  public register(username: string, email: string, password: string) {
      this.authServie.createAccount(username,email,password);
  }

}
