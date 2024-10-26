import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ControllerService} from "../../services/controller.service";

@Component({
  selector: 'app-load-file',
  templateUrl: './load-file.component.html',
  styleUrls: ['./load-file.component.css']
})
export class LoadFileComponent implements OnInit, AfterViewInit {

  @ViewChild('loadFile') loadFile: any;
  @ViewChild('uploadForm') uploadForm: any;
  @ViewChild('inputFile') inputFile: any;
  @ViewChild('inputFileText') inputFileText: any;

  constructor(private controllerService: ControllerService) { }

  ngOnInit(): void {

  }

  @Output() closeEmit = new EventEmitter<boolean>();

  ngAfterViewInit() {
    const self = this;
    this.inputFile.nativeElement.onchange = (event: any) => {
      let file = event.target.files[0];
      this.inputFileText.nativeElement.innerText = file.name;
    }
    this.uploadForm.nativeElement.onsubmit = async function(event: any) {
      event.preventDefault();
      const formData = new FormData();
      const fileInput: any = document.getElementById('csvFile');
      formData.append('csvFile', fileInput.files[0]);
      self.controllerService.setFileName(fileInput.files[0].name.split('.')[0]);

      // Отправляем запрос на сервер
      const response = await fetch('http://localhost:8081/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`load files: ${JSON.stringify(result)}`)
        const columns = result.columns[0].name.split(',');
        const rows = result.rows;
        self.controllerService.setHeaders(columns);
        self.controllerService.setRows(rows);
        // await self.createTable(fileInput.files[0].name, rows);
        self.closeEmit.emit(true);
      } else {
        console.log('error');
      }
    };
  }

  // private async createTable(fileName: string, rows: any){
  //   const response = await fetch(`http://localhost:8080/api/dynamic/createTable?${fileName.split('.')[0]}`, {
  //     method: 'POST',
  //     body: JSON.stringify(rows)
  //   });
  //
  //   if (response.ok) {
  //     console.log(response);
  //   } else {
  //     console.log('error');
  //   }
  // }

  // public showLoadWindow() {
  //   if (this.loadFile) {
  //     if (this.loadFile.nativeElement.classList.contains('displayNone')) {
  //       this.loadFile.nativeElement.classList.remove('displayNone');
  //     } else {
  //       this.loadFile.nativeElement.classList.add('displayNone');
  //     }
  //   }
  // }
}
