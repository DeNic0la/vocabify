import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(private authServie: AuthService, private toasterService: ToasterService) { }

  public isLoading: boolean = false;

  public async register(username: string, email: string, password: string) {
    this.isLoading = true;
    try {
      await this.authServie.createAccount(username, email, password);
    } catch (error: any) {
      this.toasterService.showToast('error', error.message)
    }
    this.isLoading = false;

    // TODO Redirect
  }
}
