import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constantes } from '../utils/constantes';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AcompananteSrvService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(Constantes.SERVER_URI + 'api/v1/acompanante');
   }

   getAcompanantes() {
    return this.http.get(Constantes.SERVER_URI + 'api/v1/acompanante').pipe(
      map(res => {
        return res;
      })
    );
   }
}
