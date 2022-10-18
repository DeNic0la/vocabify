import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SoundService } from '../services/sound.service';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private authSerivce: AuthService,
    private toasterService: ToasterService,
    private router: Router,
    private sounds: SoundService
  ) {}

  public isLoading: boolean = false;

  public async login(email: string, password: string) {
    this.sounds.playSound('login.mp3');
    this.isLoading = true;
    try {
      await this.authSerivce.login(email, password);
      this.router.navigate(['']);
    } catch (error: any) {
      this.toasterService.showToast('error', error.message);
    }
    this.isLoading = false;
  }
}
