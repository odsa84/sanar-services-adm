import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendServBtwPagesAdmService {

  serv: any;

  constructor() { }

  public getObjServ() {
    return this.serv;
  }

  public setObjServ(data) {
    this.serv = data;
  }
}
