import { Component, OnInit, Pipe } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsSrvService } from '../../services/products-srv.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { SendServBtwPagesAdmService } from '../../services/send-serv-btw-pages-adm.service';
import { PersonasSrvService } from '../../services/personas-srv.service';
import { TipoProductoSrvService } from 'src/app/services/tipo-producto-srv.service';

@Component({
  selector: 'app-lst-products',
  templateUrl: './lst-products.page.html',
  styleUrls: ['./lst-products.page.scss'],
})
export class LstProductsPage implements OnInit {

  titulo: string  = "Productos";
  productos: Observable<any>;
  tipoProductos: any = [];
  servicio: any;
  servData: any;
  persona: any;
  items: any = [];

  segmenTodo: boolean = true;

  constructor(
    private productoSrv: ProductsSrvService,
    private tipoProductoSrv: TipoProductoSrvService,
    private router: Router,
    private menu: MenuController,
    private personaSrv: PersonasSrvService,
    private sendServ: SendServBtwPagesAdmService,
  ) {     
    this.menu.enable(true, 'admMenu');
    this.servData = this.sendServ.getObjServ(); 
    this.getTipoProductos(this.servData.categoria.id);    
    
    this.getProductosByServicio();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    
  }

  ionViewDidEnter() {

  }

  getProductosByServicio() {
    this.productos = null;
    this.productos = this.productoSrv.getProductoByServicio(this.servData.id); 
  }

  getProductosByServTipoProducto(idTipoProd) {
    /*this.productos.pipe (
      map(items => 
       items.filter(item => item.tipoProducto.id = idTipoProd)));
    
       this.productos.forEach(elem => {
        console.log(elem);
       })*/   
       
    this.productos = null;
    this.productos = this.productoSrv.getProductoByServAndTipoProducto(this.servData.id, idTipoProd);
  }

  logout() {
    this.personaSrv.logout();
    this.router.navigateByUrl('/index');    
  }

  detalleProducto(elProd) {
    this.sendServ.setObjServ(elProd);
    this.router.navigateByUrl('/view-product');
  }

  editarProducto(elProd) {
    this.sendServ.setObjServ(elProd);
    this.router.navigateByUrl('/edit-products');
  }

  crearProducto() {
    this.sendServ.setObjServ(this.servData);
    this.router.navigateByUrl('/new-products');
  }

  getTipoProductos(idCat) {    
    this.items = [];
    this.tipoProductoSrv.getTipoProductoByCategoria(idCat).subscribe(res => {      
      res.forEach(elem => {        
        this.items = [...this.items, {
          id: elem.id,
          name: elem.nombre
        }]
      });
    });    
  }

  segmentChanged(event) {
  }

  /*detalleServicio(elServ) {
    this.sendServ.setObjServ(elServ);
    this.router.navigateByUrl('/edit-services');
  }*/

}
