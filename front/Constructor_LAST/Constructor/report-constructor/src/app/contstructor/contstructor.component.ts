import { Component, OnInit } from '@angular/core';
import {ControllerService} from "../../services/controller.service";

@Component({
  selector: 'app-contstructor',
  templateUrl: './contstructor.component.html',
  styleUrls: ['./contstructor.component.css']
})
export class ContstructorComponent implements OnInit {

  constructor(private controllerService: ControllerService) { }

  ngOnInit(): void {
  }

  public saveTemplate(){
    this.controllerService.saveNewTemplate();
  }
}
