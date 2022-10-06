import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent {
  isLoading = false;
  email: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  async sendPasswordReset(email: string) {
    this.isLoading = true;
    await this.auth.sendPasswordReset(email);
    this.router.navigate(['login'])
  }
}
