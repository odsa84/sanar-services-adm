import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constantes } from '../utils/constantes';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaSrvService {

  constructor(
    private http: HttpClient
  ) { }

  devolverProvincias() {
    return this.http.get(Constantes.SERVER_URI + 'api/v1/provincia/');
  }

  devolverProvinciaPorId(id) {
    return this.http.get(Constantes.SERVER_URI + 'api/v1/provincia/' + id);
  }
}
