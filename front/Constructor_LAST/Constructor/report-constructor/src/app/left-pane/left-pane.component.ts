import { Component, OnInit, ViewChild } from '@angular/core';
import { DragndropService } from 'src/services/dragndrop.service';
import {BlocsService} from "../../services/blocs.service";

@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['./left-pane.component.css']
})
export class LeftPaneComponent implements OnInit {

  constructor(public dragndropService: DragndropService,
              private blocsService: BlocsService) {}

  @ViewChild('addBlockWindow') addBlockWindow: any;
  // public types = ['string', 'number', 'boolean'];
  public isShowCreateBlock: boolean = false;
  public isShowUpdateBlock: boolean = false;
  public blocks: any = [];
  public oldName: string = '';

  ngOnInit(): void {
    this.blocks = this.blocsService.getBlocks();
  }

  public addBlock() {
    this.isShowCreateBlock = !this.isShowCreateBlock;
    if (!this.isShowCreateBlock) this.blocks = this.blocsService.getBlocks();
  }

  public updateBlock(event: any) {
    this.isShowUpdateBlock = true;
    this.oldName = event;
  }

  public closeUpdate(){
    this.isShowUpdateBlock = false;
    this.blocks = this.blocsService.getBlocks();
  }

  public countBlock(name: string){
    return this.blocks.filter((el: any) => el.name === name)[0];
  }
}
