import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToasterService } from 'src/app/services/toaster.service';
import { AuthService } from '../auth.service';
import { Toaster } from '../types/toaster';

@Component({
  selector: 'app-auth-handling',
  templateUrl: './auth-handling.component.html',
  styleUrls: ['./auth-handling.component.scss'],
})
export class AuthHandlingComponent implements OnDestroy {
  subscriptions = new Subscription();
  isLoading: boolean = true;
  password: string = '';
  repeatedPassword: string = '';
  mode: string = '';
  oobCode: string = '';

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
  ) {
    const sub = this.auth.currentUser.subscribe(() => {
      const routeSub = this.route.queryParams.subscribe(async (params) => {
        await this.checkRequest(params);
      });
      this.subscriptions.add(routeSub);
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async resetPassword(password: string, repeatPw: string) {
    this.isLoading = true;
    try {
      this.auth.validatePassword(password, repeatPw);
      await this.auth.resetPassword(this.oobCode, password);
      this.router.navigate(['login']);
    } catch (error: any) {
      this.toasterService.showToast('error', error.message);
    }
    this.isLoading = false;
  }

  private async checkRequest(params: Params) {
    if (
      !params['oobCode'] ||
      !params['mode'] ||
      !(await this.isCodeValid(params['oobCode']))
    ) {
      this.router.navigate(['home']);
      return;
    }
  }

  private async isCodeValid(oobCode: string): Promise<Boolean> {
    try {
      await this.auth.verifyPasswordResetCode(oobCode);
      return true;
    } catch (error) {
      return false;
    }
  }
}
