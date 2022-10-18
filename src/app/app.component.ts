import { Component } from '@angular/core';
import { ToasterService } from './services/toaster.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'vocabify';

  constructor(public toasterService: ToasterService) {
    const isAndroid = navigator.userAgent.toLowerCase().indexOf('android') > -1;
    if (isAndroid) {
      document.write(
        '<meta name="viewport" content="width=device-width,height=' +
          window.innerHeight +
          ', initial-scale=1.0">'
      );
    }
  }
}
