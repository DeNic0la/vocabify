import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-handling',
  templateUrl: './auth-handling.component.html',
  styleUrls: ['./auth-handling.component.scss']
})
export class AuthHandlingComponent {
  subscriptions = new Subscription();
  isLoading = true;
  mode: string = '';

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,

  ) {
    const sub = this.auth.currentUser.subscribe(() => {
      if (!this.route.queryParams) this.router.navigate(['home']);
      const routeSub = this.route.queryParams
        .subscribe(async params => {
          if (params['mode']) {
            this.mode = params['mode'];
            switch (this.mode) {
              case 'resetPassword':
                await this.handlePasswordReset(params['oobCode']);
                break;
              default:
                this.router.navigate(['home']);
            }
          } else {
            this.router.navigate(['home']);
          }
        }
        );
      this.subscriptions.add(routeSub);
    });
    this.subscriptions.add(sub);
  }

  async handlePasswordReset(oobCode: string) {
    if (oobCode) {
      try {
        await this.auth.verifyPasswordResetCode(oobCode);
      } catch (error) {
        this.router.navigate(['home']);
      }
      this.isLoading = false;
    } else {
      this.router.navigate(['home']);
    }
  }
}
