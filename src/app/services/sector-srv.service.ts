import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constantes } from '../utils/constantes';

@Injectable({
  providedIn: 'root'
})
export class SectorSrvService {

  constructor(
    private http: HttpClient
  ) { }

  devolverSectores() {
    return this.http.get(Constantes.SERVER_URI + 'api/v1/sector/');
  }

  devolverSectoresPorCiudad(idCiudad) {
    return this.http.get(Constantes.SERVER_URI + 'api/v1/sector/ciudad/' + idCiudad);
  }
}
