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
import { LoaderComponent } from './ui/loader/loader.component';

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
    LoaderComponent,
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
