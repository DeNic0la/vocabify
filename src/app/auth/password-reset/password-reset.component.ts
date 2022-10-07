import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  isLoading: boolean = false;
  email: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toasterService: ToasterService
  ) {}

  async sendPasswordReset(email: string) {
    this.isLoading = true;
    try {
      await this.auth.sendPasswordReset(email);
      this.router.navigate(['login']);
    } catch (error: any) {
      this.toasterService.showToast('error', error.message);
      this.isLoading = false;
    }
  }
}
