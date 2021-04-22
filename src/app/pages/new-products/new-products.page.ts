import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProductsSrvService } from '../../services/products-srv.service';
import { TipoProductoSrvService } from '../../services/tipo-producto-srv.service';
import { Observable, from } from 'rxjs';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController, ToastController, Platform, 
  LoadingController, AlertController, IonSlides, ModalController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';

import { finalize } from 'rxjs/operators';
import { SevicesSrvService } from '../../services/sevices-srv.service';
import { Router } from '@angular/router';
import { SendServBtwPagesAdmService } from 'src/app/services/send-serv-btw-pages-adm.service';
import { AddTipoproductoModalPage } from '../../modals/add-tipoproducto-modal/add-tipoproducto-modal.page';
import { AcompananteSrvService } from 'src/app/services/acompanante-srv.service';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-new-products',
  templateUrl: './new-products.page.html',
  styleUrls: ['./new-products.page.scss'],
})
export class NewProductsPage implements OnInit {

  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;

  images = [];
  mainImage: any = null;

  newProdForm: FormGroup;
  servicio: Observable<any>;
  tipoProductos: Observable<any>;
  acompanantes: Observable<any>;
  data: any;
  servData: any;
  enStock: number = 1;
  precio: any;
  cantidad: any;
  unidadMedida: any;
  selectedImg: any;
  showBtn: boolean = true;
  showAcomp: boolean = false;
  tpToDelete: any;

  //acompanante: any = null;
  selectedAcomp: any[] = [];
  carouselImages = [];
  sliderTwo: any;
  slideOptsTwo = {
    initialSlide: 1,
    slidesPerView: 3,
    loop: false,
    centeredSlides: false,
    spaceBetween: 1
  };

  dataReturnedFromModal: any;
  selectedTP: any = {
    id: null,
    nombre: "",
    descripcion: ""
  };

  constructor(
    private formBuilder: FormBuilder,
    private productoSrv: ProductsSrvService,
    private tipoProductoSrv: TipoProductoSrvService,
    private acompananteSrv: AcompananteSrvService,
    private sendServ: SendServBtwPagesAdmService,
    private camera: Camera,
    private http: HttpClient,
    private file: File,
    private webview: WebView,
    private actionSheetController: ActionSheetController, 
    private toastController: ToastController,
    private storage: Storage, 
    private plt: Platform, 
    private loadingController: LoadingController,
    private filePath: FilePath, 
    private ref: ChangeDetectorRef,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router,
    private modalCtrl: ModalController
  ) {

    this.servData = this.sendServ.getObjServ();
    this.getTipoProducto(this.servData.categoria.id);

    this.newProdForm = this.formBuilder.group({
      tipoProducto: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      precio: new FormControl('', Validators.required),
      cantidad: new FormControl(''),
      unidadMedida: new FormControl(''),
      acompanante: new FormControl(null),
      imagen: new FormControl('')
    });    
  }

  ngOnInit() {
  }

  enviar_() {
    let aux: any;
    this.newProdForm.value["acompanante"] !== null ?
    this.newProdForm.value["acompanante"].forEach(element => {
      console.log(element);
    }) : console.log(aux = []);    
  }

  enviar() {
    let auxAcompSelected: any;
    this.newProdForm.value["acompanante"] !== null ?
    auxAcompSelected = this.newProdForm.value["acompanante"] : auxAcompSelected = [];
    console.log(auxAcompSelected);
    this.productoSrv.nuevoProducto(
      this.servData.id,
      this.newProdForm.value["tipoProducto"],
      this.newProdForm.value["nombre"],
      this.newProdForm.value["descripcion"],
      this.newProdForm.value["precio"],
      this.newProdForm.value["cantidad"],
      this.newProdForm.value["unidadMedida"],
      this.enStock,
      this.selectedImg,
      auxAcompSelected
    ).subscribe(res => {
        this.data = res;
        this.presentSuccessAlert('Correcto!!!', 'Ha creado nuevo producto')
      },
      (error: any) => {
        this.presentErrorAlert('Error!!!', 'Vuelva a intentarlo')
      });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddTipoproductoModalPage,
      componentProps: {
        "catId": this.servData.categoria.id
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned.data);
      if (dataReturned.data !== null) {
        this.tipoProductos = null;        
        this.getTipoProducto(this.servData.categoria.id);
        this.selectedTP = null;
        this.selectedTP = dataReturned.data;
      }
    });

    return await modal.present();
  }

  getStock(event) {
    this.enStock = event.detail.checked == true ? 1 : 0;
  }

  getTipoProducto(idCat) {
    this.tipoProductos = this.tipoProductoSrv.getTipoProductoByCategoria(idCat);
  }

  changeTipoProducto(event) {
    this.tpToDelete = event.detail.value;
    this.showBtn = false;
  }

  deleteTipoProducto() {
    this.tipoProductoSrv.editarTipoProducto(this.tpToDelete.id, this.tpToDelete.categoria.id, 
      this.tpToDelete.nombre, this.tpToDelete.descripcion, 0).subscribe(res => {
        this.data = res;
        this.presentAlert('Correcto!!!', 'Ha modificado el producto')
      },
      (error: any) => {
          this.presentErrorAlert('Error!!!', 'Vuelva a intentarlo ó consulte al administrador')
      });;
  }

  showConfirm() {
    this.alertCtrl.create({
      subHeader: 'Confirme!!!',
      message: '¿Desea eliminar el Tipo de producto?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.deleteTipoProducto();
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

  async presentAlert(header, message) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [{
          text: 'OK',
          handler: () => {
            this.tipoProductos = null;
            this.getTipoProducto(this. servData.categoria.id);
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

  getAcompanante(event) {
    if (event.detail.checked == true) {
      this.acompanantes = this.acompananteSrv.getAcompanantes();
      this.showAcomp = true;
    } else {
      this.acompanantes = null;
      this.showAcomp = false;
    }
  }

  changeAcompnanate(event) {

  }

  /*** Images works***/
  loadStoredImages() {
    this.storage.get(STORAGE_KEY).then(images => {
      if (images) {
        let arr = JSON.parse(images);
        this.images = [];
        for (let img of arr) {
          let filePath = this.file.dataDirectory + img;
          let resPath = this.pathForImage(filePath);
          this.images.push({ name: img, path: resPath, filePath: filePath });
        }
      }
    });
  }
 
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }
 
  async presentToast(text) {
    const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }

  selectMainImage(image: any) {
    this.mainImage = null;
    this.mainImage = image;
  }
  
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
        header: "Seleccionar fuente",
        buttons: [{
                text: 'Subir imagen',
                handler: () => {
                  this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
            {
                text: 'Desde la Camara',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.CAMERA);
                }
            },
            {
                text: 'Cancelar',
                role: 'cancel'
            }
        ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true
    };
 
    this.camera.getPicture(options).then(imagePath => {
        if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
            this.filePath.resolveNativePath(imagePath)
                .then(filePath => {
                    let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                    let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                    this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                });
        } else {
            var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
            var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        }
    });    
  }

  createFileName() {
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
    return newFileName;
  } 

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
        this.updateStoredImages(newFileName);
    }, error => {
        this.presentToast('Error while storing file.');
    });
  }

  updateStoredImages(name) {
    this.storage.get(STORAGE_KEY).then(images => {
        let arr = JSON.parse(images);
        if (!arr) {
            let newImages = [name];
            this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
        } else {
            arr.push(name);
            this.storage.set(STORAGE_KEY, JSON.stringify(arr));
        }
 
        let filePath = this.file.dataDirectory + name;
        let resPath = this.pathForImage(filePath);
 
        let newEntry = {
            name: name,
            path: resPath,
            filePath: filePath
        };
 
        this.images = [newEntry, ...this.images];
        this.carouselImages = [newEntry, ...this.carouselImages];
        this.mainImage = newEntry;
        this.selectedImg = resPath;
        this.ref.detectChanges(); // trigger change detection cycle
    });
  }

  deleteImage(imgEntry, position) {
    let aux = this.carouselImages.filter(item => {
      return item.name !== imgEntry.name;
    })
    this.carouselImages = [];
    this.carouselImages = aux
    //this.images.splice(position, 1);
    //this.carouselImages.splice(position, 1);
    this.mainImage = this.carouselImages[0];
 
    this.storage.get(STORAGE_KEY).then(images => {
        let arr = JSON.parse(images);
        let filtered = arr.filter(name => name != imgEntry.name);
        this.storage.set(STORAGE_KEY, JSON.stringify(filtered));
 
        var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);
 
        this.file.removeFile(correctPath, imgEntry.name).then(res => {
            this.presentToast('File removed.');
        });
    });
  }

  /***Para subir una imagen al servidor (backend)***/
  startUpload(imgEntry) {
    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
    .then(entry => {
        ( < FileEntry > entry).file(file => this.readFile(file))
    })
    .catch(err => {
        this.presentToast('Error while reading file.');
    });
} 

readFile(file: any) {
  const reader = new FileReader();
  reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
          type: file.type
      });
      formData.append('file', imgBlob, file.name);
      this.uploadImageData(formData);
  };
  reader.readAsArrayBuffer(file);
}

async uploadImageData(formData: FormData) {
  const loading = await this.loadingController.create({
      message: 'Uploading image...'
  });
  await loading.present();

  this.http.post("http://localhost:8888/upload.php", formData)
  .pipe(
      finalize(() => {
          loading.dismiss();
      })
  )
  .subscribe(res => {
      if (res['success']) {
          this.presentToast('File upload complete.')
      } else {
          this.presentToast('File upload failed.')
      }
  });
}

//Move to Next slide
slideNext(object, slideView) {
  slideView.slideNext(500).then(() => {
    this.checkIfNavDisabled(object, slideView);
  });
}

//Move to previous slide
slidePrev(object, slideView) {
  slideView.slidePrev(500).then(() => {
    this.checkIfNavDisabled(object, slideView);
  });;
}

//Method called when slide is changed by drag or navigation
slideDidChange(object, slideView) {
  this.checkIfNavDisabled(object, slideView);
}

//Call methods to check if slide is first or last to enable disbale navigation  
checkIfNavDisabled(object, slideView) {
  this.checkisBeginning(object, slideView);
  this.checkisEnd(object, slideView);
}

checkisBeginning(object, slideView) {
  slideView.isBeginning().then((istrue) => {
    object.isBeginningSlide = istrue;
  });
}

checkisEnd(object, slideView) {
  slideView.isEnd().then((istrue) => {
    object.isEndSlide = istrue;
  });
}

}