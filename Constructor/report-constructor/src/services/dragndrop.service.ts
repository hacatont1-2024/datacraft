import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DragndropService {

  constructor() { }

  private panel: any;
  private target: any;

  public onDragStart(item: any) {
    const parent: any = document.getElementById(item);
    this.panel = document.createElement('div');
    this.panel.innerText = parent.innerText;
    this.panel.style.background = 'white';
    this.panel.style.height = '30px';
    this.panel.style.padding = '5px';
    this.panel.style.borderRadius = '15px';
    this.panel.style.cursor = 'all-scroll';
  }

  public onDragOver(event: any) {
    this.target = event.target;
    event.preventDefault();
  }

  public onDragReStart(event: any) {
    this.panel = event.target;
  }

  public onDrop(event: any) {
    this.panel.style.position = 'absolute';
    this.panel.style.left = event.clientX - 560 + 'px';
    this.panel.style.top = event.clientY - 75 + window.scrollY + 'px';
    this.panel.draggable = 'true';
    this.panel.ondragstart = (event: any) => {
      this.onDragReStart(event);
    }
    if (this.target){
      this.target.append(this.panel);
    }
    this.panel = null;
  }

  public onDropTrash(){
    this.panel.remove();
  }
}
