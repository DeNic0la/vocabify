import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Toaster } from '../types/toaster';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  isLoading: boolean = false;
  toaster: Toaster = {
    show: false,
    color: 'error',
    message: '',
  };
  email: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  async sendPasswordReset(email: string) {
    this.isLoading = true;
    try {
      if (!RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}').test(email)) {
        throw new Error('The email is badly formatted.');
      }
      await this.auth.sendPasswordReset(email);
      this.router.navigate(['login']);
    } catch (error: any) {
      this.toaster.message = error.message;
      this.toaster.show = true;
      this.isLoading = false;
    }
  }
}
