import { ToasterColor } from 'src/app/ui/toaster/toaster.types';

export interface Toaster {
  show: boolean;
  color: ToasterColor;
  message: string;
}
