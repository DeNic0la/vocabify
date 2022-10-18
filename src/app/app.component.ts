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
    const viewport: HTMLMetaElement = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement;
    viewport.setAttribute(
      'content',
      viewport.content + `, height=${window.innerHeight}`
    );
  }
}
