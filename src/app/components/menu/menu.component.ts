import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { MenuController, Events } from '@ionic/angular';
import { PersonasSrvService } from '../../services/personas-srv.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  menuTitle: string;

  constructor(
    private storage: Storage,
    private router: Router,
    private menu: MenuController,
    private personaSrv: PersonasSrvService,
    private events: Events
  ) {
    this.events.subscribe('user-logged', (user) => {
      console.log(user)
      this.menuTitle = user.nombre + ' ' + user.apellido;
    });
   }

  ngOnInit() {}

  logout() {
    this.menu.toggle();
    this.personaSrv.logout();
    this.router.navigateByUrl('/login'); 
  }

  crearServicio() {
    this.menu.toggle();
    this.router.navigateByUrl('/new-services'); 
  }

  crearAcompanante() {
    this.menu.toggle();
    this.router.navigateByUrl('/new-acompanante');
  }

}
