import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonasSrvService } from '../../services/personas-srv.service';
import { Storage } from '@ionic/storage';
import { MenuController } from '@ionic/angular';
import { SevicesSrvService } from '../../services/sevices-srv.service';
import { SendServBtwPagesAdmService } from '../../services/send-serv-btw-pages-adm.service';

@Component({
  selector: 'app-adm-services',
  templateUrl: './adm-services.page.html',
  styleUrls: ['./adm-services.page.scss'],
})
export class AdmServicesPage implements OnInit {

  titulo: string  = "Administrar Servicios";
  servicios: Observable<any>;
  persona: any;

  constructor(
    private personaSrv: PersonasSrvService,
    private router: Router,
    private storage: Storage,
    private menu: MenuController,
    private serviceSrv: SevicesSrvService,
    private sendServ: SendServBtwPagesAdmService,
    private actRoute: ActivatedRoute
  ) {     
    this.menu.enable(true, 'admMenu');
     
  }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.storage.get('user').then((res => {
      if(res) {        
        this.persona = res; 
        this.servicios = this.serviceSrv.getServiciosByPersona(this.persona.id);                   
      }
    })).catch(error => console.log(error));
  }

  logout() {
    this.personaSrv.logout();
    this.router.navigateByUrl('/index');    
  }

  detalleServicio(elServ) {
    this.sendServ.setObjServ(elServ);
    this.router.navigateByUrl('/edit-services');
  }

  /*mostrarProductos(elServ) {
    this.sendServ.setObjServ(elServ);
    this.router.navigateByUrl('/lst-products');
    //alert("Muestra productos");
  }*/

  mostrarProductos(elServ) {
    this.sendServ.setObjServ(elServ);
    this.router.navigateByUrl('/tablinks');
    //alert("Muestra productos");
  }

}
