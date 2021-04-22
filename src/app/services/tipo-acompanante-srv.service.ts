import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constantes } from '../utils/constantes';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TipoAcompananteSrvService {

  constructor(private http: HttpClient) { }

  getTipoAcompByServicio(idServicio): Observable<any> {
    return this.http.get<any>(Constantes.SERVER_URI + 'api/v1/tipoAcompanante/servicio/' + idServicio).pipe(
      map(res => {
        return res;
      })
    );
  }

   nuevoTipoAcompnanate(idMarca: number, nombre: string, descripcion: string) {
    return this.http.post(Constantes.SERVER_URI + 'api/v1/tipoAcompanante/crear', {
      "marca": {
          "id": idMarca	
      },
      "nombre": nombre,
      "descripcion": descripcion,
      "estado": 1
    });
 }

 editarTipoAcompnanate(id: number, idMarca: number, nombre: string, descripcion: string, estado: number) {
  return this.http.post(Constantes.SERVER_URI + 'api/v1/tipoAcompanante/modificar', {
    "id": id,
    "categoria": {
        "id": idMarca	
    },
    "nombre": nombre,
    "descripcion": descripcion,
    "estado": estado
  });
}
}
