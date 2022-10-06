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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'design', component: UiTestComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'storify',
    component: StorifyComponent,
    children: [
      {
        path: '',
        component: ShomeComponent,
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
