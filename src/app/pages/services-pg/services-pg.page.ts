import { Component, OnInit, ViewChild } from '@angular/core';
import { SevicesSrvService } from 'src/app/services/sevices-srv.service';
import { SendObjBtwPagesService } from '../../services/send-obj-btw-pages.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';


@Component({
  selector: 'app-services-pg',
  templateUrl: './services-pg.page.html',
  styleUrls: ['./services-pg.page.scss'],
})
export class ServicesPgPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;

  data: Observable<any>;
  obj: any;
  titulo: string;
  //dataScrl: any[] = Array(this.data.subscribe.length/2);

  constructor(
    private serviceSrv: SevicesSrvService, 
    private actRoute: ActivatedRoute, 
    private router: Router, 
    private sendObj: SendObjBtwPagesService
    ) { 
      this.obj = this.sendObj.getObj();
      this.titulo = this.obj.nombre;
      this.data = this.serviceSrv.getServiciosByCategoria(this.obj.id);

    /*this.actRoute.queryParams.subscribe((res)=> {  
      this.titulo = res.nombre;    
      this.data = this.serviceSrv.getServiciosByCategoria(res.id);
    });*/
  }

  ngOnInit() {
    
  }

  detalleServicio(servicio) {
    /*let serv= {
      nombre: servicio.nombre,
    };

    this.router.navigate(['/serv-detail'], {
      queryParams: serv
    })*/

    this.sendObj.setObj(servicio);
    this.router.navigateByUrl('/serv-detail');
  }
}
