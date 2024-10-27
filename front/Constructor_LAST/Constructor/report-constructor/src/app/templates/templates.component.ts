import { Component, OnInit } from '@angular/core';
import {ControllerService} from "../../services/controller.service";

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {

  constructor(private controllerService: ControllerService) { }

  public templates: any = [];
  public isSelectTemplate = false;
  public headers: Array<string> = [];
  public filterRows: Array<any> = [];
  public selectRows: any;
  public headerSearch = '';
  public maxElems = 100;
  private selectedElems: any = [];
  private tempNow: any;

  ngOnInit(): void {
    this.templates = this.controllerService.getTemplates();

    this.headers = this.controllerService.getHeaders();
    this.filterRows = this.controllerService.getFilterRows();
    this.headerSearch = this.headers[0];
  }

  public openTemplate(temp: any){
    this.tempNow = temp;
    this.isSelectTemplate = !this.isSelectTemplate;
  }

  public getIndex(str: any){
    return this.filterRows.findIndex((el: any) => el === str);
  }

  private isSelect = false;
  public selectAll(){
    this.isSelect = !this.isSelect;
    const inputs: any = document.querySelectorAll('.selectInput');
    for (let input of inputs){
      input.checked = this.isSelect;
    }

    this.selectedElems = [];
    if (this.isSelect){
      for(let row of this.filterRows) {
        this.selectedElems.push(row);
      }
    }
  }

  public selectElem(event: any){
    const ind = event.target.parentElement.parentElement.id;
    if (event.srcElement.checked){
      this.selectedElems.push(this.filterRows[ind]);
    } else {
      this.selectedElems = [];
      const inputs: any = document.querySelectorAll('.selectInput');
      for (let input of inputs){
        if (input.checked){
          const i = input.parentElement.parentElement.id;
          this.selectedElems.push(this.filterRows[i]);
        }
      }
    }
  }

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

  private createJson(){
    const json: any = {
      template: []
    }

    console.log(this.tempNow);
    for (let str of this.selectedElems){
      const report: any = {
        texts: []
      }
      for (let text of this.tempNow.texts){
        let newText: any = {
          text: text.text,
          size: text.size,
          x: text.x,
          y: text.y,
        }
        let val = text.text;
        const headers = [...val.matchAll(/\${(.*?)}/g)].map(match => match[1]);

        for (let m of headers){
          const ind = this.headers.findIndex((el: any) => el === m);
          newText.text = this.replaceWord(newText.text, m, str[ind]).split('${').join('').split('}').join('');
        }
        report.texts.push(newText);
      }
      json.template.push(report);
    }

    return json;
  }

  public getReport(){
    const json = this.createJson();
    fetch('http://localhost:8081/api/create-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(json)
    })
      .then(response => {
        if (response.ok) {
          return response.blob(); // Получаем PDF как Blob
        }
        throw new Error('Network response was not ok.');
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'report.pdf'; // Имя файла для скачивания
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Ошибка:', error);
      });
  }

  private replaceWord(text: string, oldWord: string, newWord: string) {
    const regex = new RegExp(`\\b${oldWord}\\b`, 'g');
    return text.replace(regex, newWord);
  }
}
