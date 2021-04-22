import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TipoProductoSrvService } from '../../services/tipo-producto-srv.service';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController, AlertController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { Router } from '@angular/router';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { Storage } from '@ionic/storage';
import { SendServBtwPagesAdmService } from '../../services/send-serv-btw-pages-adm.service';

import { finalize } from 'rxjs/operators';
import { ProductsSrvService } from '../../services/products-srv.service';
import { SevicesSrvService } from '../../services/sevices-srv.service';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.page.html',
  styleUrls: ['./edit-products.page.scss'],
})
export class EditProductsPage implements OnInit {

  images = [];

  editProdForm: FormGroup;
  tipoProductos: Observable<any>;
  servicios: Observable<any>;
  data: any;
  prodData: any;
  selectedTP: any;
  selectedS: any;
  selectedImg: any;
  enStock: number;
  toggleChkd: any;

  constructor(
    private formBuilder: FormBuilder,
    private productoSrv: ProductsSrvService,
    private tipoProductoSrv: TipoProductoSrvService,
    private sendServ: SendServBtwPagesAdmService,
    private servicioSrv: SevicesSrvService,
    private camera: Camera, 
    private file: File, 
    private http: HttpClient, 
    private webview: WebView,
    private actionSheetController: ActionSheetController, 
    private storage: Storage, 
    private plt: Platform, 
    private loadingController: LoadingController,
    private filePath: FilePath, 
    private ref: ChangeDetectorRef,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router,
  ) { 
    this.prodData = this.sendServ.getObjServ();
    this.getTipoProducto();

    this.selectedTP = this.prodData.tipoProducto;
    this.selectedS = this.prodData.servicio;
    this.toggleChkd = this.prodData.stock;
    this.getServiciosPorPersona(this.prodData.servicio.persona.id);
    this.enStock = this.prodData.stock;

    this.editProdForm = this.formBuilder.group({
      nombre: new FormControl(this.prodData.nombre, Validators.required),
      descripcion: new FormControl(this.prodData.descripcion, Validators.required),
      precio: new FormControl(this.prodData.precio, Validators.required),
      cantidad: new FormControl(this.prodData.cantidad, Validators.required),
      unidadMedida: new FormControl(this.prodData.unidadMedida, Validators.required),
      servicio: new FormControl(this.selectedS.id, Validators.required),
      tipoProducto: new FormControl(this.selectedTP.id, Validators.required),
    });
  }

  ngOnInit() {
    let newEntry = {
      name: '',
      path: this.prodData.imagen,
      filePath: ''
    };
    this.images = [newEntry];
    this.selectedImg = this.prodData.imagen;
  }
  getServiciosPorPersona(idPersona: number) {
    this.servicios = this.servicioSrv.getServiciosByPersona(idPersona);
  }

  getTipoProducto() {
    this.tipoProductos = this.tipoProductoSrv.getTipoProductoByCategoria(this.prodData.servicio.categoria.id);
  }  

  changeTipoProducto($event) {

  }

  enviar() {
    this.productoSrv.editarProducto(
      this.prodData.id,
      this.prodData.servicio.id,
      this.editProdForm.value["tipoProducto"],
      this.editProdForm.value["nombre"],
      this.editProdForm.value["descripcion"],
      this.editProdForm.value["precio"],
      this.editProdForm.value["cantidad"],
      this.editProdForm.value["unidadMedida"],
      this.enStock,
      this.selectedImg,
      1
    ).subscribe(res => {
        this.data = res;
        this.presentAlert('Correcto!!!', 'Ha modificado el producto')
      },
      (error: any) => {
          this.presentErrorAlert('Error!!!', 'Vuelva a intentarlo ó consulte al administrador')
      });
  }

  showConfirm() {
    this.alertCtrl.create({
      subHeader: 'Confirme!!!',
      message: '¿Desea eliminar este Producto?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.cambiarEstadoACeroEliminarProd();
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

  cambiarEstadoACeroEliminarProd() {
    this.productoSrv.editarProducto(
      this.prodData.id,
      this.prodData.servicio.id,
      this.editProdForm.value["tipoProducto"],
      this.editProdForm.value["nombre"],
      this.editProdForm.value["descripcion"],
      this.editProdForm.value["precio"],
      this.editProdForm.value["cantidad"],
      this.editProdForm.value["unidadMedida"],
      this.enStock,
      this.selectedImg,
      0
    ).subscribe(res => {
        this.data = res;
        this.presentAlert('Correcto!!!', 'Se eliminó el producto')
      },
      (error: any) => {
          this.presentErrorAlert('Error!!!', 'Vuelva a intentarlo ó consulte al administrador')
      });
  }

  async presentAlert(header, message) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigateByUrl('/adm-services');
          }
        }]
    });

    await alert.present();
  }

  async presentErrorAlert(header, message) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [{
        text: 'OK'
      }]
    });

    await alert.present();
  }

  getStock(event) {
    this.toggleChkd = !this.toggleChkd;
    this.enStock = this.toggleChkd == true ? 1 : 0;
    console.log(this.enStock);
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
    const toast = await this.toastCtrl.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
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
        this.selectedImg = resPath;
        this.ref.detectChanges(); // trigger change detection cycle
    });
  }

  deleteImage(imgEntry, position) {
    this.images.splice(position, 1);
 
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

}
