import { Component } from '@angular/core';

import { Platform/*, MenuController */} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
/*import { PersonasSrvService } from './services/personas-srv.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';*/

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  
  menuTitle: string;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    /*private personaSrv: PersonasSrvService,
    private router: Router,
    private menu: MenuController,
    private storage: Storage*/
  ) {
    this.initializeApp();
    /*this.storage.get('user').then(res => {
      if(res) {
        this.menuTitle = res.nombre;
      }
    }).catch(error => console.log(error))*/
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  /*logout() {
    this.menu.toggle();
    this.personaSrv.logout();
    this.router.navigateByUrl('/index'); 
  }

  crearServicio() {
    this.menu.toggle();
  }*/
}
