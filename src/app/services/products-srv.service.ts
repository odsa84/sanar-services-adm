import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constantes } from '../utils/constantes';
import { DecimalPipe } from '@angular/common';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsSrvService {

  constructor(private http: HttpClient) { }

  getProductoByServicio(idServicio) {
    return this.http.get(Constantes.SERVER_URI + 'api/v1/producto/servicio/' + idServicio);
   }

   getByServicio(idServicio) {
    return this.http.get(Constantes.SERVER_URI + 'api/v1/producto/servicio/' + idServicio).pipe(
      map(res => {
        return res;
      })
    );
   }

   nuevoProducto(idServicio: number, tipoProducto: any, nombre: string, descripcion: string, 
    precio: any, cantidad: number, unidad_medida: string, stock: number, imagen: string, acompanantes: any) {
      return this.http.post(Constantes.SERVER_URI + 'api/v1/producto/crear', {
        "servicio": {
            "id": idServicio	
        },
        "tipoProducto": {
              "id": tipoProducto.id
        },
        "nombre": nombre,
        "descripcion": descripcion,
        "precio": precio,
        "cantidad": cantidad,
        "unidadMedida": unidad_medida,
        "stock": stock,
        "imagen": imagen,
        "acompanantes": acompanantes,
        "estado": 1
      });
   }

   editarProducto(id: number, idServicio: number, idTipoProducto: number, nombre: string, descripcion: string, 
    precio: any, cantidad: number, unidad_medida: string, stock: number, imagen: string, estado: number) {
      return this.http.post(Constantes.SERVER_URI + 'api/v1/producto/modificar', {
        "id": id,
        "servicio": {
          "id": idServicio	
        },
        "tipoProducto": {
              "id": idTipoProducto
        },
        "nombre": nombre,
        "descripcion": descripcion,
        "precio": precio,
        "cantidad": cantidad,
        "unidadMedida": unidad_medida,
        "stock": stock,
        "imagen": imagen,
        "estado": estado
      });
   }

   getProductoByServAndTipoProducto(idServicio, idProd) {
    return this.http.get(Constantes.SERVER_URI + 'api/v1/producto/servicio/tipoProducto/' 
    + idServicio + '/' + idProd);
   }
}
