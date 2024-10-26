import { Component, OnInit, ViewChild } from '@angular/core';
import { DragndropService } from 'src/services/dragndrop.service';

@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['./left-pane.component.css']
})
export class LeftPaneComponent implements OnInit {

  constructor(public dragndropService: DragndropService) {}

  @ViewChild('addBlockWindow') addBlockWindow: any;
  public types = ['string', 'number', 'boolean'];
  public isShowCreateBlock: boolean = false;

  ngOnInit(): void {
  }

  public addBlock() {
    this.isShowCreateBlock = !this.isShowCreateBlock;
  }

}
