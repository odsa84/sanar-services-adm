import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constantes } from '../utils/constantes';

@Injectable({
  providedIn: 'root'
})
export class CiudadSrvService {

  constructor(
    private http: HttpClient
  ) { }

  devolverCiudades() {
//    return this.http.get(Constantes.SERVER_URI + 'sanar-services/api/v1/ciudad/');
      return this.http.get(Constantes.SERVER_URI + 'api/v1/ciudad/');
  }
  
  devolerCiudadesPorProvincia(idProvincia) {
    //return this.http.get(Constantes.SERVER_URI + 'sanar-services/api/v1/ciudad/provincia/' + idProvincia);
    return this.http.get(Constantes.SERVER_URI + 'api/v1/ciudad/provincia/' + idProvincia);
  }
}