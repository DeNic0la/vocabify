import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent {
  private static maxFileSize: number = 5000000;

  @Output('file') fileChange: EventEmitter<File> = new EventEmitter<File>();

  @ViewChild('fileDropRef')
  fileDropRef: ElementRef<HTMLInputElement> | undefined;

  constructor(private toast: ToasterService) {}

  file: File | undefined;

  fileBrowseHandler(event: any) {
    /*Pretend the File was Dropped*/
    this.fileDropped(event.target.files);
  }

  fileDropped(Files: File[]) {
    /*Just Emit the First File*/
    const seFile = Files[0];
    if (seFile) {
      if (
        seFile.size < ImageUploadComponent.maxFileSize &&
        seFile.type.startsWith('image')
      ) {
        this.fileChange.emit(Files[0]);
      } else {
        this.toast.showToast('error', 'You Selected a Invalid File');
      }
    }
  }
}
