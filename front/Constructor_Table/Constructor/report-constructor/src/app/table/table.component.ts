import {Component, OnDestroy, OnInit} from '@angular/core';
import {ControllerService} from "../../services/controller.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {

  constructor(private controllerService: ControllerService) { }

  public headers: Array<string> = [];
  public rows: Array<any> = [];
  public selectRows: any;
  public headerSearch = '';
  public maxElems = 100;
  public newRow: any = [];
  public isCreate = false;

  ngOnInit(): void {
    this.headers = this.controllerService.getHeaders();
    this.rows = this.controllerService.getRows();
    if (this.rows.length > this.maxElems) this.rows = this.rows.splice(0, this.maxElems);
    this.headerSearch = this.headers[0];

    document.onkeyup = (event) => {
      this.deleteStr(event);
    }
  }

  public setHeaderSearch(event: any){
    this.headerSearch = event.target.value;
  }

  public setMaxValue(event: any){
    this.maxElems = event.target.value;
    this.rows = this.controllerService.getRows();
    if (this.rows.length > this.maxElems) this.rows = this.rows.splice(0, this.maxElems);
  }

  public searchElems(e: any){
    try {
      // const allArrows = document.getElementsByClassName('arrow');
      // for (let arrow of allArrows) arrow.style = 'display: none';

      if (e.target.value){
        this.rows = this.controllerService.getRows();
        const arr = [];
        for (let item of this.rows){
          const elems = item[0].split(',');
          if (elems[this.headers.findIndex((el: any) => el === this.headerSearch)].toUpperCase().includes(e.target.value.toUpperCase())){
            arr.push(item);
          }
        }
        this.rows = arr;
        if (this.rows.length > this.maxElems) this.rows = this.rows.splice(0, this.maxElems);
      } else {
        this.rows = this.controllerService.getRows();
        if (this.rows.length > this.maxElems) this.rows = this.rows.splice(0, this.maxElems);
      }
    } catch (e){
      console.dir(e);
    }
  }

  public selectRow(event: any){
    if (this.selectRows) this.selectRows.style.background = '';
    const parent = event.target.parentElement;
    parent.style.background = 'cornflowerblue';
    this.selectRows = parent;
  }

  public async deleteStr(event: any){
    // const fileName = this.controllerService.getFileName();
    // if (event.code === 'Delete' && this.selectRows){
    //   const data = {};
    //   // Отправляем запрос на сервер
    //   const response = await fetch(`http://localhost:8080/api/dynamic/${fileName}/delete`, {
    //     method: 'DELETE',
    //     body: JSON.stringify(data)
    //   });
    //
    //   if (response.ok) {
    //     console.log(response);
    //     this.selectRows.remove();
    //   } else {
    //     console.log('error');
    //   }
    // }
    const row = this.selectRows.id;
    this.controllerService.deleteRow(row);
    this.selectRows.remove();
  }

  ngOnDestroy() {
    document.onkeyup = null;
  }

  public openRow(){
    this.isCreate = !this.isCreate;
  }
  public createRow(){
    this.newRow = [];
    let mass: any = [];
    let inputs: any = document.querySelectorAll('.createInput');
    for(let i of inputs) mass.push(i);
    for (let head of this.headers){
      let m: any = mass.filter((el: any) => el.id === head);
      if (m[0]){
        this.newRow.push(m[0].value);
      }
    }
    this.rows.push([this.newRow.join(',')]);
    this.openRow();
  }
}
