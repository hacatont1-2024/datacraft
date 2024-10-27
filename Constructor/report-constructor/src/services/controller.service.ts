import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  constructor() {}

  private headers: Array<string> = [];
  private rows: Array<any> = [];
  private fileName = '';

  private obj = {
    template: [{
      texts: [{
        text: 'test 123: ${event_id}',
        size: 12,
        x: 100,
        y: 20
      },{
        text: 'test 321: ${date}, gg wp: ${new_value}',
        size: 12,
        x: 100,
        y: 20
      }]
    }, {
      texts: [{
        text: 'здесь вторая страница: ${old_value}',
        size: 12,
        x: 100,
        y: 20
      },{
        text: 'а здесь второй текст на этой странице: ${date}, и вот вторя подставляемая запись: ${new_value}',
        size: 12,
        x: 100,
        y: 20
      }]
    }]
  }

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
