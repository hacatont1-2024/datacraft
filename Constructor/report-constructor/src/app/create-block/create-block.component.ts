import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-create-block',
  templateUrl: './create-block.component.html',
  styleUrls: ['./create-block.component.css']
})
export class CreateBlockComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Output() closeEmit = new EventEmitter<boolean>();

  public close(){
    this.closeEmit.emit(true);
  }
}
