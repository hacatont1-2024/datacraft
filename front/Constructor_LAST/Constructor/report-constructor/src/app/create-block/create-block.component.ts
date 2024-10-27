import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BlocsService} from "../../services/blocs.service";
import {ControllerService} from "../../services/controller.service";

@Component({
  selector: 'app-create-block',
  templateUrl: './create-block.component.html',
  styleUrls: ['./create-block.component.css']
})
export class CreateBlockComponent implements OnInit {

  constructor(private blocService: BlocsService,
              private controllerService: ControllerService) { }

  ngOnInit(): void {
    document.addEventListener('contextmenu', event => event.preventDefault());
    this.headers = this.controllerService.getHeaders();
  }

  @ViewChild('name') nameElem: any;
  @ViewChild('text') textElem: any;
  @ViewChild('size') sizeElem: any;
  @ViewChild('menu') menuElem: any;

  @Input() oldName: string = '';
  @Input() nameI: string = '';
  @Input() textI: string = '';
  @Input() sizeI: string = '';

  @Output() closeEmit = new EventEmitter<boolean>();

  public headers: any = [];
  private savePos: number = 0;

  public close(){
    this.closeEmit.emit(true);
  }

  public createBlock(){
    if (!this.oldName)
      this.blocService.createBlock(this.nameElem.nativeElement.value, this.textElem.nativeElement.value, this.sizeElem.nativeElement.value);
    else this.blocService.updateBlock(this.oldName, this.nameElem.nativeElement.value, this.textElem.nativeElement.value, this.sizeElem.nativeElement.value);
    this.closeEmit.emit(true);
  }

  public openHeader(event: any){
    this.savePos = event.target.selectionStart;
    this.menuElem.nativeElement.style.display = 'block';
    this.menuElem.nativeElement.style.top = event.clientY + 'px';
    this.menuElem.nativeElement.style.left = event.clientX + 'px';
  }

  public closeHeader(){
    this.menuElem.nativeElement.style.display = 'none';
  }

  public addHeader(head: string){
    const swiftInsert = (original: string, index: number, insert: string) => original.substring(0, index) + insert + original.substring(index);
    const addText = '${' + head + '}';
    this.textElem.nativeElement.value = swiftInsert(this.textElem.nativeElement.value, this.savePos, addText);
    this.closeHeader();
  }
}
