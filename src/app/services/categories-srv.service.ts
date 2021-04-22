import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constantes } from '../utils/constantes';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriesSrvService {

  constructor(private http: HttpClient/*, private constantes: Constantes*/) { }
  
  getCategorias() {
    return this.http.get(Constantes.SERVER_URI + "api/v1/categoria/");
  }

  getCategoriasPorId(idCategoria: number): Observable<any> {
    return this.http.get(Constantes.SERVER_URI + 'api/v1/categoria/id/' + idCategoria)
    .pipe(
      map(res => {
        return res;
      }));
  }

}
