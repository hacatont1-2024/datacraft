import { Injectable } from '@angular/core';
import {BlocsService} from "./blocs.service";

@Injectable({
  providedIn: 'root'
})
export class DragndropService {

  constructor(private blocService: BlocsService) { }

  private panel: any;
  private target: any;

  public onDragStart(item: any) {
    const parent: any = document.getElementById(item);
    this.panel = document.createElement('div');
    this.panel.innerText = this.blocService.countBlock(parent.innerText).text;
    this.panel.style.fontSize = this.blocService.countBlock(parent.innerText).size + 'px';
    this.panel.style.background = 'white';
    this.panel.style.cursor = 'all-scroll';
  }

  public onDragOver(event: any) {
    this.target = event.target;
    event.preventDefault();
  }

  public mouseDownEvent(event: any){
    // event.target.style.left = event.target.offsetLeft + event.target.offsetWidth + 'px';
    // event.target.style.left = event.target.offsetTop + event.target.offsetHeight + 'px';
  }

  public onDragReStart(event: any) {
    this.panel = event.target;
    // this.panel.style.left = this.panel.offsetLeft + this.panel.offsetWidth + 'px';
    // this.panel.style.left = this.panel.offsetTop + this.panel.offsetHeight + 'px';
  }

  public onDrop(event: any) {
    const right: any = document.getElementById('work-space');
    this.panel.style.position = 'absolute';
    this.panel.style.left = event.clientX - right.offsetLeft + 'px';
    this.panel.style.top = event.clientY - right.offsetTop + window.scrollY + 'px';
    this.panel.draggable = 'true';
    this.panel.onmousedown = (event: any) => {
      this.mouseDownEvent(event);
    }
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
