import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendObjBtwPagesService {

  obj: any;

  constructor() { }

  public getObj() {
    return this.obj;
  }

  public setObj(data) {
    this.obj = data;
  }
}
