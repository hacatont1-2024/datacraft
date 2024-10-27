import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  constructor() {}

  private headers: Array<string> = [];
  private rows: Array<any> = [];
  private fileName = '';

  public setHeaders(headers: Array<string>){
    this.headers = headers;
  }
  public getHeaders(){
    return this.headers;
  }

  public setRows(rows: Array<any>){
    this.rows = rows;
  }
  public getRows(){
    return JSON.parse(JSON.stringify(this.rows));
  }
  public deleteRow(row: string){
    for (let str of this.rows){
      if (str[0] === row) {
        this.rows.splice(this.rows.findIndex(el => el === str), 1);
        break;
      }
    }
  }
  public insertRow(row: any){
    this.rows.push(row);
  }

  public setFileName(name: string){
    this.fileName = name;
  }
  public getFileName(){
    return this.fileName;
  }
}
