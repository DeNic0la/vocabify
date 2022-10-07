import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UiTestComponent } from './ui/ui-test/ui-test.component';
import { ButtonComponent } from './ui/button/button.component';
import { TextfieldComponent } from './ui/textfield/textfield.component';
import { CardComponent } from './ui/card/card.component';
import { DialogComponent } from './ui/dialog/dialog.component';
import { IconComponent } from './ui/icon/icon.component';
import { HeaderComponent } from './ui/header/header.component';
import { StorifyComponent } from './storify/storify.component';
import { GameComponent } from './storify/game/game.component';
import { ShomeComponent } from './storify/shome/shome.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthHandlingComponent } from './auth/auth-handling/auth-handling.component';
import { LoaderComponent } from './ui/loader/loader.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { CardGridComponent } from './ui/card-grid/card-grid.component';
import { ToasterComponent } from './ui/toaster/toaster.component';
import { GameLobbyCardComponent } from './ui/game-lobby-card/game-lobby-card.component';
import { LobbyComponent } from './storify/lobby/lobby.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    UiTestComponent,
    ButtonComponent,
    TextfieldComponent,
    CardComponent,
    DialogComponent,
    IconComponent,
    HeaderComponent,
    StorifyComponent,
    GameComponent,
    ShomeComponent,
    LoginComponent,
    UiTestComponent,
    RegisterComponent,
    AuthHandlingComponent,
    LoaderComponent,
    PasswordResetComponent,
    CardGridComponent,
    ToasterComponent,
    GameLobbyCardComponent,
    LobbyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
