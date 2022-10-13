import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {

  @ViewChild('fileDropRef')
  fileDropRef: ElementRef<HTMLInputElement> | undefined

  constructor() { }

  ngOnInit(): void {
  }

  chooseFile(){
    if (this.fileDropRef)
      this.fileDropRef.nativeElement.click();
    else
      console.log("LOL");
  }

}
