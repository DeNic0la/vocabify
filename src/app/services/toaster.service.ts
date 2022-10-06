import { Injectable } from '@angular/core';
import { Toaster } from '../auth/types/toaster';
import { ToasterColor } from '../ui/toaster/toaster.types';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  public toaster: Toaster = {
    show: false,
    color: 'error',
    message: '',
  };

  constructor() {}

  showToast(color: ToasterColor, message: string) {
    this.toaster.color = color;
    this.toaster.message = message;
    this.toaster.show = true;
  }
}
