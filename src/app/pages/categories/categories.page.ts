import { Component, OnInit } from '@angular/core';
import { CategoriesSrvService } from '../../services/categories-srv.service';
import { SevicesSrvService } from '../../services/sevices-srv.service';
import { SendObjBtwPagesService } from '../../services/send-obj-btw-pages.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  data: Observable<any>;
  servicios: Observable<any>;
  titulo: string = "Categorias";

  constructor(private categoriesSrv: CategoriesSrvService, private servicesSrv: SevicesSrvService, 
    private router: Router, private sendObj: SendObjBtwPagesService) { }

  ngOnInit() {
    this.data = this.categoriesSrv.getCategorias();
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

}
