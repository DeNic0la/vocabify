import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(
    private authServie: AuthService,
    private toasterService: ToasterService,
    private router: Router
  ) {}

  public isLoading: boolean = false;

  public async register(username: string, email: string, password: string, repeatedpassword: string) {
    this.isLoading = true;
<<<<<<< HEAD
    try {
      await this.authServie.createAccount(username, email, password);
      this.router.navigate(['']);
    } catch (error: any) {
      this.toasterService.showToast('error', error.message);
    }
=======

    await this.authServie.createAccount(username, email, password, repeatedpassword);
>>>>>>> dcde115 (repeatedpassword)
    this.isLoading = false;
  }
}
