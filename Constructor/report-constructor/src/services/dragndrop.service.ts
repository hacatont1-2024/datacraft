import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DragndropService {

  constructor() { }

  public onDragStart(item: any) {
    console.log(item);
  }

  public onDragOver(event: any) {
    console.log(event);
    event.preventDefault();
  }

  public onDrop(event: any) {
    console.log(event);
  }
}
