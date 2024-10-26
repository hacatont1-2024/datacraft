import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  constructor() {}

  private headers: Array<string> = [];

  public setHeaders(headers: Array<string>){
    this.headers = headers;
  }
}
