import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  constructor() {}

  private headers: Array<string> = [];
  private rows: Array<any> = [];
  private filterRows: Array<any> = [];
  private fileName = '';

  private newTemplate: any = {
    name: 'newTemplate' + 1,
    texts: []
  };
  private templates: any = {
    template: []
  };

  public setHeaders(headers: Array<string>){
    this.headers = headers;
  }
  public getHeaders(){
    return this.headers;
  }

  public getFilterRows(){
    return this.filterRows;
  }
  public setFilterRows(rows: any){
    this.filterRows = rows;
  }

  public setRows(rows: Array<any>){
    this.rows = rows;
    this.filterRows = this.rows.splice(0, 100);
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

  public getNewTemplate(id: any){
    const elem = this.newTemplate.texts.filter((el: any) => el.id === id);
    if (elem.length > 0){
      return elem[0];
    } else {
      return null;
    }
  }
  public addTextNewTemplate(text: any){
    this.newTemplate.texts.push(text);
  }
  public saveNewTemplate(){
    this.templates.template.push(JSON.parse(JSON.stringify(this.newTemplate)));
    this.newTemplate = {
      name: 'newTemplate' + (this.templates.template.length + 1),
      texts: []
    };
  }
  public deleteTextInNewTemplate(id: any){
    const ind = this.newTemplate.texts.findIndex((el: any) => el.id === id);
    if (ind !== -1) this.newTemplate.texts.splice(ind, 1);
  }

  public getTemplates(){
    return  this.templates.template;
  }
}
