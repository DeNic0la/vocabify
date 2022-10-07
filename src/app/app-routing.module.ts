import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthHandlingComponent } from './auth/auth-handling/auth-handling.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import { GameComponent } from './storify/game/game.component';
import { ShomeComponent } from './storify/shome/shome.component';
import { StorifyComponent } from './storify/storify.component';
import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';
import { LobbyComponent } from './storify/lobby/lobby.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
  },
  {
    path: 'storify',
    component: StorifyComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: ShomeComponent,
      },
      {
        path: 'lobby',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'lobby/:id',
        component: LobbyComponent,
      },
      {
        path: 'game',
        component: GameComponent,
      },
    ],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
  },

  { path: '_/auth/action', component: AuthHandlingComponent },
  { path: 'reset-password', component: PasswordResetComponent },

  { path: '**', component: NotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
