import { Injectable } from '@angular/core';
import { Constantes } from '../utils/constantes';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TipoProductoSrvService {

  constructor(private http: HttpClient) { }

  /*getTipoProductoByCategoria(idCategoria) {
    return this.http.get(Constantes.SERVER_URI + 'api/v1/tipoProducto/categoria/' + idCategoria);
   }*/

   getTipoProductoByCategoria(idCategoria): Observable<any> {
    return this.http.get<any>(Constantes.SERVER_URI + 'api/v1/tipoProducto/categoria/' + idCategoria).pipe(
      map(res => {
        return res;
      })
    );    

    /*return this.http.post<any>(`${this.baseUrl}/ConsultarEspecialidad`, {}).pipe(
      map(res => {
        return res;
      }));*/
   }

   nuevoTipoProducto(idCategoria: number, nombre: string, descripcion: string) {
    return this.http.post(Constantes.SERVER_URI + 'api/v1/tipoProducto/crear', {
      "categoria": {
          "id": idCategoria	
      },
      "nombre": nombre,
      "descripcion": descripcion,
      "estado": 1
    });
 }

 editarTipoProducto(id: number, idCategoria: number, nombre: string, descripcion: string, estado: number) {
  return this.http.post(Constantes.SERVER_URI + 'api/v1/tipoProducto/modificar', {
    "id": id,
    "categoria": {
        "id": idCategoria	
    },
    "nombre": nombre,
    "descripcion": descripcion,
    "estado": estado
  });
}
}
