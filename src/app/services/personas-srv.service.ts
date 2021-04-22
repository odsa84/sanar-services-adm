import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Persona } from '../models/Persona';
import { tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Constantes } from '../utils/constantes';

@Injectable({
  providedIn: 'root'
})
export class PersonasSrvService {

  isLoggedIn = false;
  token: any;

  constructor(
    private http: HttpClient, 
    private storage: Storage
    ) { }

    devolverPersonas() {
      //return this.http.get(Constantes.SERVER_URI + 'sanar-services/api/v1/persona/');
      return this.http.get(Constantes.SERVER_URI + 'api/v1/persona/');
    }

  login(email: String, password: String) {
    //return this.http.post(Constantes.SERVER_URI + 'sanar-services/api/v1/persona/login',
    return this.http.post(Constantes.SERVER_URI + 'api/v1/persona/login',
      {
        mail: email,
        password: password        
      }
    ).pipe(tap(persona => {
      this.isLoggedIn = true;
      /*this.storage.set('user', persona).then(() => {
        console.log('Token Stored');
      },
      error => console.error('Error storing item', error)
    );*/
      return persona;
    }),
    );
  }

  register(nombre: string, apellido: string, cedula: string, telefono: string, email: string, 
    password: string) {
    return this.http.post(Constantes.SERVER_URI + 'api/v1/persona/crear',
      {
        nombre: nombre,
        apellido: apellido,
        cedula: cedula,
        telefono: telefono,
        email: email,
        password: password
      }
    )
  }

  logout() {
    this.storage.remove("user");
    this.isLoggedIn = false;
    this.storage.get("user").then(res=>{
      console.log(res);
    });
    /*const headers = new HttpHeaders({
      'Authorization': this.token["token_type"] + " " + this.token["access_token"]
    });
    return this.http.get('http://192.168.0.3:8080/api/v1/persona/logout', 
      { headers: headers })
    .pipe(
      tap(data => {
        this.storage.remove("token");
        this.isLoggedIn = false;
        delete this.token;
        return data;
      })
    )*/
  }

  /*user() {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"] + " " + this.token["access_token"]
    });
    return this.httpClient.get<Persona>('http://192.168.0.3:8081/api/v1/persona/email/' + 
    this.persona.getEmail(), {
       headers: headers 
    })
    .pipe(
      tap(user => {
        return user;
      })
    )
  }*/

  getToken() {
    return this.storage.get('token').then (data => {
        this.token = data;
        if(this.token != null) {
          this.isLoggedIn=true;
        } else {
          this.isLoggedIn=false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn=false;
      }
    );
  }

}
