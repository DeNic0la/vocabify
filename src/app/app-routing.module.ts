import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthHandlingComponent } from './auth/auth-handling/auth-handling.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UiTestComponent } from './ui/ui-test/ui-test.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'design', component: UiTestComponent },
  { path: '_/auth/action', component: AuthHandlingComponent },
  { path: '**', component: NotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
