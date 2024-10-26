import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'report-constructor';
  public mode: number = 0;

  public setMode(mode: any) {
    this.mode = mode;
  }
}
