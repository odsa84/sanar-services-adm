import { Component, OnInit } from '@angular/core';
import { CategoriesSrvService } from '../../services/categories-srv.service';
import { SevicesSrvService } from '../../services/sevices-srv.service';
import { SendObjBtwPagesService } from '../../services/send-obj-btw-pages.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PersonasSrvService } from '../../services/personas-srv.service';
import { MenuController} from '@ionic/angular';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {

  data: Observable<any>;
  servicios: Observable<any>;
  titulo: string = "Categorias";

  constructor(
    private categoriesSrv: CategoriesSrvService, 
    private servicesSrv: SevicesSrvService,
    private personaSrv: PersonasSrvService, 
    private router: Router, 
    private sendObj: SendObjBtwPagesService,
    private menu: MenuController
    ) { 
      this.menu.enable(false, 'admMenu');      
    }

  ngOnInit() {     
    this.data = this.categoriesSrv.getCategorias();
  }

  navegarAdminServicios() {}

  navegarServicios() {}

  navegar() {
    if(!this.personaSrv.isLoggedIn) {
      this.router.navigateByUrl('/login');
    } else {
      this.router.navigateByUrl('/adm-services');
    }
  }

  getServiciosByCategoria(idCategoria, nombreCategoria) {
    let cat = {
      id: idCategoria,
      nombre: nombreCategoria
    };
    this.sendObj.setObj(cat);
    this.router.navigateByUrl('/services-pg');
    /*this.router.navigate(['/services-pg'], {
      queryParams: cat,
    })*/
  }

  /*categorias: Categoria[] = [
    {
      icon: 'american-football',
      name: 'Servicios',
      redirectTo: '/services-pg'
    },
    {
      icon: 'appstore',
      name: 'Alert',
      redirectTo: '/alert'
    },
    {
      icon: 'beaker',
      name: 'Avatar',
      redirectTo: '/avatar'
    },
    {
      icon: 'radio-button-on',
      name: 'Botones y router',
      redirectTo: '/botones'
    },
    {
      icon: 'card',
      name: 'Cards',
      redirectTo: '/card'
    },
    {
      icon: 'checkmark-circle-outline',
      name: 'Ceckbox',
      redirectTo: '/check'
    },
    {
      icon: 'calendar',
      name: 'DateTime',
      redirectTo: '/date-time'
    },
    {
      icon: 'car',
      name: 'Fabs',
      redirectTo: '/fab'
    },
    {
      icon: 'grid',
      name: 'Grid - Rows',
      redirectTo: '/grid'
    },
    {
      icon: 'infinite',
      name: 'Infinite Scroll',
      redirectTo: '/infinite-scroll'
    },
    {
      icon: 'hammer',
      name: 'input - Forms',
      redirectTo: '/input'
    },
    {
      icon: 'list',
      name: 'Listas - Sliding',
      redirectTo: '/list'
    }
  ];*/

}

interface Categoria {
  icon: string;
  name: string;
  redirectTo: string;
}
