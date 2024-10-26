import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css']
})
export class BlocksComponent implements OnInit {

  @Input() type: any;

  constructor() { }

  ngOnInit(): void {
  }

}
