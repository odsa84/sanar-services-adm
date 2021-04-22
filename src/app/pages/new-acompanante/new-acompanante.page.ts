import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonSlides, ModalController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProductsSrvService } from 'src/app/services/products-srv.service';
import { Router } from '@angular/router';
import { SendServBtwPagesAdmService } from 'src/app/services/send-serv-btw-pages-adm.service';
import { AddTipoacompananteModalPageModule } from 'src/app/modals/add-tipoacompanante-modal/add-tipoacompanante-modal.module';
import { TipoAcompananteSrvService } from 'src/app/services/tipo-acompanante-srv.service';

@Component({
  selector: 'app-new-acompanante',
  templateUrl: './new-acompanante.page.html',
  styleUrls: ['./new-acompanante.page.scss'],
})
export class NewAcompanantePage implements OnInit {

  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;

  newAcompForm: FormGroup;
  productos: Observable<any>;
  tipoAcompanantes: Observable<any>;
  servData: any;
  enStock: number = 1;
  nombre: any;
  descripcion: any;
  taToDelete: any;
  showBtn: boolean = true;

  dataReturnedFromModal: any;
  selectedTA: any = {
    id: null,
    nombre: "",
    descripcion: ""
  };

  constructor(
    private formBuilder: FormBuilder,
    private productoSrv: ProductsSrvService,
    private sendServ: SendServBtwPagesAdmService,
    //private tipoAcompananteSrv: TipoAcompananteSrvService,
    private router: Router,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    /*this.servData = this.sendServ.getObjServ();
    this.productos = this.productoSrv.getByServicio(this.servData.id);*/
    
    this.newAcompForm = this.formBuilder.group({
      /*producto: new FormControl('', Validators.required),
      tipoAcompanante: new FormControl('', Validators.required),*/
      nombre: new FormControl('', Validators.required),      
      descripcion: new FormControl(''),
    });   
  }

  ngOnInit() {
  }

  getStock(event) {
    this.enStock = event.detail.checked == true ? 1 : 0;
  }

  /*async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddTipoacompananteModalPageModule,
      componentProps: {
        "catId": this.servData.categoria.id
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned.data);
      if (dataReturned.data !== null) {
        this.tipoAcompanantes = null;        
        //this.getTipoProducto(this.servData.categoria.id);
        this.selectedTA = null;
        this.selectedTA = dataReturned.data;
      }
    });

    return await modal.present();
  }*/

  enviar() {

  }

  /*showConfirm() {
    this.alertCtrl.create({
      subHeader: 'Confirme!!!',
      message: '¿Desea eliminar el Tipo de producto?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.deleteTipoAcompanante();
          }
        },
        {
          text: 'No',
          handler: () => {
            
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  deleteTipoAcompanante() {
    this.tipoAcompananteSrv.editarTipoAcompnanate(this.taToDelete.id, this.taToDelete.marca.id, 
      this.taToDelete.nombre, this.taToDelete.descripcion, 0).subscribe(res => {
        this.presentAlert('Correcto!!!', 'Ha modificado el producto')
      },
      (error: any) => {
          this.presentErrorAlert('Error!!!', 'Vuelva a intentarlo ó consulte al administrador')
      });;
  }*/

  async presentAlert(header, message) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [{
          text: 'OK',
          handler: () => {
            this.tipoAcompanantes = null;
            //this.getTipoAcompanante(this.servData.id);
            this.showBtn = true;
          }
        }]
    });

    await alert.present();
  }

  async presentSuccessAlert(header, message) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigateByUrl('/tablinks/productos');
          }
        }]
    });

    await alert.present();
  }

  async presentErrorAlert(header, message) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message
    });

    await alert.present();
  }

  /*getTipoAcompanante(idServ) {
    this.tipoAcompanantes = this.tipoAcompananteSrv.getTipoAcompByServicio(idServ);
  }

  changeTipoAcompnanate(event) {
    this.taToDelete = event.detail.value;
    this.showBtn = false;
  }*/

}
