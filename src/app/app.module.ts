import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ButtonComponent } from './ui/button/button.component';
import { TextfieldComponent } from './ui/textfield/textfield.component';
import { CardComponent } from './ui/card/card.component';
import { DialogComponent } from './ui/dialog/dialog.component';
import { IconComponent } from './ui/icon/icon.component';
import { HeaderComponent } from './ui/header/header.component';
import { StorifyComponent } from './storify/storify.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthHandlingComponent } from './auth/auth-handling/auth-handling.component';
import { LoaderComponent } from './ui/loader/loader.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { CardGridComponent } from './ui/card-grid/card-grid.component';
import { ToasterComponent } from './ui/toaster/toaster.component';
import { GameLobbyCardComponent } from './ui/game-lobby-card/game-lobby-card.component';
import { LobbyComponent } from './storify/lobby/lobby.component';
import { HttpClientModule } from '@angular/common/http';
import { StorifyExploreComponent } from './storify/storify-explore/storify-explore.component';
import { SubmissionComponent } from './storify/game/submission/submission.component';
import { GameComponent } from './storify/game/game.component';
import { TimerComponent } from './ui/timer/timer.component';
import { WinnerViewComponent } from './storify/game/winner-view/winner-view.component';
import { SettingsComponent } from './storify/settings/settings.component';
import { ImageUploadComponent } from './ui/image-upload/image-upload.component';
import { DragAndDropDirective } from './ui/image-upload/drag-and-drop.directive';
import { SubmissionsViewComponent } from './storify/game/submissions-view/submissions-view.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    ButtonComponent,
    TextfieldComponent,
    CardComponent,
    DialogComponent,
    IconComponent,
    HeaderComponent,
    StorifyComponent,
    LoginComponent,
    RegisterComponent,
    AuthHandlingComponent,
    LoaderComponent,
    PasswordResetComponent,
    CardGridComponent,
    ToasterComponent,
    GameLobbyCardComponent,
    LobbyComponent,
    StorifyExploreComponent,
    SubmissionComponent,
    GameComponent,
    TimerComponent,
    WinnerViewComponent,
    SettingsComponent,
    ImageUploadComponent,
    DragAndDropDirective,
    SubmissionsViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
