import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-load-file',
  templateUrl: './load-file.component.html',
  styleUrls: ['./load-file.component.css']
})
export class LoadFileComponent implements OnInit {

  @ViewChild('loadFile') loadFile: any;

  constructor() { }

  ngOnInit(): void {
  }

  public showLoadWindow() {
    if (this.loadFile) {
      if (this.loadFile.nativeElement.classList.contains('displayNone')) {
        this.loadFile.nativeElement.classList.remove('displayNone');
      } else {
        this.loadFile.nativeElement.classList.remove('displayNone');
      }
    }
  }
}
