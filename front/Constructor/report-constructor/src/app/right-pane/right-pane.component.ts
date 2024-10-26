import { Component, OnInit } from '@angular/core';
import { DragndropService } from 'src/services/dragndrop.service';

@Component({
  selector: 'app-right-pane',
  templateUrl: './right-pane.component.html',
  styleUrls: ['./right-pane.component.css']
})
export class RightPaneComponent implements OnInit {

  constructor(public dragndropService: DragndropService) { }

  ngOnInit(): void {
  }

}
