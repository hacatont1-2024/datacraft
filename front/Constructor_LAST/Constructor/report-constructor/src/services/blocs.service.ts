import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlocsService {

  constructor() { }

  private blocks: any = [];

  public getBlocks(){
    return this.blocks;
  }
  public createBlock(name: string, text: string, size: number){
    if (this.blocks.findIndex((el: any) => el.name === name) === -1){
      this.blocks.push({
        name: name,
        text: text,
        size: size
      });
    }
  }
  public deleteBlock(name: string){
    const ind = this.blocks.findIndex((el: any) => el.name === name);
    if (ind !== -1) this.blocks.splice(ind, 1);
  }
  public updateBlock(oldName: string, name: string, text: string, size: number){
    if (this.blocks.findIndex((el: any) => el.name === name) === -1){
      const block = this.blocks.filter((el: any) => el.name === oldName)[0];
      block.name = name;
      block.text = text;
      block.size = size;
    }
  }

  public countBlock(name: string){
    const block = this.blocks.filter((el: any) => el.name === name);
    return block.length > 0 ? block[0]: null;
  }
}
