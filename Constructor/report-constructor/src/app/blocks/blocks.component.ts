import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css']
})
export class BlocksComponent implements OnInit {

  @Input() type: any;
  @Output() openEditEmit = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }
  public isEdit = false;

  public openEdit(){
    this.isEdit = !this.isEdit;
    this.openEditEmit.emit(this.type);
  }
}
