import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UiTestComponent } from './ui/ui-test/ui-test.component';
import { RegisterComponent } from './register/register.component';
import { CreateComponent } from './storify/create/create.component';
import { GameComponent } from './storify/game/game.component';
import { JoinComponent } from './storify/join/join.component';
import { ShomeComponent } from './storify/shome/shome.component';
import { StorifyComponent } from './storify/storify.component';
import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'design', component: UiTestComponent },
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
        path: 'join',
        component: JoinComponent,
      },
      {
        path: 'create',
        component: CreateComponent,
      },
      {
        path: 'game',
        component: GameComponent,
      },
    ],
  },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: NotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
