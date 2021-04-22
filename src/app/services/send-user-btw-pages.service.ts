import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendUserBtwPagesService {

  user: any;

  constructor() { }

  public getObj() {
    return this.user;
  }

  public setObj(data) {
    this.user = data;
  }
}
