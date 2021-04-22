import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constantes } from '../utils/constantes';

@Injectable({
  providedIn: 'root'
})
export class SevicesSrvService {

  constructor(private http: HttpClient) { }

  getServicios() {
    return this.http.get(Constantes.SERVER_URI + 'api/v1/servicio/');
  }

  getServiciosByCategoria(idCategoria) {
    return this.http.get(Constantes.SERVER_URI + 'api/v1/servicio/categoria/' + idCategoria);
   }

   getServiciosByPersona(idPersona) {
    return this.http.get(Constantes.SERVER_URI + 'api/v1/servicio/persona/' + idPersona);
   }

   nuevoServicio(idPersona: number, categoria: any, idSector: number, 
    nombre: string, descripcion: string, sitioWeb: string, fecha_creado_negocio: Date, calle_principal: string, 
    numeracion: string, calle_secundaria: string, detalle_adicional: string, imagen: string) {
      return this.http.post(Constantes.SERVER_URI + 'api/v1/servicio/crear', {
        "persona": {
            "id": idPersona	
        },
        "categoria": {
              "id": categoria.id,
              "imagen": categoria.imagen
        },
        "sector": {
              "id": idSector
        },
        "nombre": nombre,
        "descripcion": descripcion,
        "sitioWeb": sitioWeb,
        "fechaCreadoNegocio": fecha_creado_negocio,
        "callePrincipal": calle_principal,
        "numeracion": numeracion,
        "calleSecundaria": calle_secundaria,
        "detalleAdicional": detalle_adicional,        
        "imagen": imagen,
        "estado": 1
      });
   }

   editarServicio(id: number, idPersona: number, idCategoria: number, idSector: number, 
    nombre: string, descripcion: string, sitioWeb: string, fecha_creado_negocio: Date, calle_principal: string, 
    numeracion: string, calle_secundaria: string, detalle_adicional: string, imagen: string) {
      return this.http.post(Constantes.SERVER_URI + 'api/v1/servicio/modificar', {
        "id": id,
        "persona": {
            "id": idPersona	
        },
        "categoria": {
          "id": idCategoria
    },
        "sector": {
              "id": idSector
        },
        "nombre": nombre,
        "descripcion": descripcion,
        "sitioWeb": sitioWeb,
        "fechaCreadoNegocio": fecha_creado_negocio,
        "callePrincipal": calle_principal,
        "numeracion": numeracion,
        "calleSecundaria": calle_secundaria,
        "detalleAdicional": detalle_adicional,        
        "imagen": imagen,
        "estado": 1
      });
   }

}
