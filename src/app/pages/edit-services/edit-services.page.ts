import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PersonasSrvService } from '../../services/personas-srv.service';
import { CategoriesSrvService } from '../../services/categories-srv.service';
import { Observable } from 'rxjs';
import { SendServBtwPagesAdmService } from '../../services/send-serv-btw-pages-adm.service';
import { ProvinciaSrvService } from '../../services/provincia-srv.service';
import { CiudadSrvService } from '../../services/ciudad-srv.service';
import { SectorSrvService } from '../../services/sector-srv.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController, AlertController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';

import { finalize } from 'rxjs/operators';
import { SevicesSrvService } from '../../services/sevices-srv.service';
import { Router } from '@angular/router';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-edit-services',
  templateUrl: './edit-services.page.html',
  styleUrls: ['./edit-services.page.scss'],
})
export class EditServicesPage implements OnInit {

  images = [];

  editServForm: FormGroup;
  personas: Observable<any>;
  categorias: Observable<any>;
  provincias: Observable<any>;
  ciudades: Observable<any>;
  sectores: Observable<any>;
  data: any;
  servData: any;
  selectedP: any;
  selectedC: any;
  selectedProv: any;
  selectedCiu: any;
  selectedSec: any;
  selectedDate: any;
  selectedImg: any;

  constructor(
    private formBuilder: FormBuilder,
    private personaSrv: PersonasSrvService,
    private caetegoriaSrv: CategoriesSrvService,
    private sendServ: SendServBtwPagesAdmService,
    private provinciaSrv: ProvinciaSrvService,
    private ciudadSrv: CiudadSrvService,
    private sectorSrv: SectorSrvService,
    private serviceSrv: SevicesSrvService,
    private camera: Camera, 
    private file: File, 
    private http: HttpClient, 
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
    private router: Router
  ) {
    this.servData = this.sendServ.getObjServ();

    this.getPersonas();
    this.getCategorias(),
    this.getPovincias();           

    this.selectedP = this.servData.persona;
    this.selectedC = this.servData.categoria;
    this.selectedProv = this.servData.sector.ciudad.provincia;
    this.selectedCiu = this.servData.sector.ciudad;
    this.getCiudades(this.selectedProv.id);
    this.selectedSec = this.servData.sector; 
    this.getSectores(this.selectedCiu.id);
    this.selectedDate = this.servData.fechaCreadoNegocio;     

    this.editServForm = this.formBuilder.group({
      persona: new FormControl(this.selectedP.id, Validators.required),
      categoria: new FormControl(this.selectedC.id, Validators.required),
      nombre: new FormControl(this.servData.nombre, Validators.required),
      descripcion: new FormControl(this.servData.descripcion, Validators.required),
      sitioWeb: new FormControl(this.servData.sitioWeb),
      fechaCreadoNegocio: new FormControl(this.selectedDate, Validators.required),
      callePrincipal: new FormControl(this.servData.callePrincipal),
      numeracion: new FormControl(this.servData.numeracion),
      calleSecundaria: new FormControl(this.servData.calleSecundaria),
      provincia: new FormControl(this.selectedProv.id, Validators.required),
      ciudad: new FormControl(this.selectedCiu.id, Validators.required),
      sector: new FormControl(this.selectedSec.id, Validators.required),
      detalleAdicional: new FormControl(this.servData.detalleAdicional)
    });
  }

  ngOnInit() {
    let newEntry = {
      name: '',
      path: this.servData.imagen,
      filePath: ''
    };
    this.images = [newEntry];
    this.selectedImg = this.servData.imagen;

    /*this.plt.ready().then(() => {
      this.loadStoredImages();
    });*/
  }
  getPersonas() {
    this.personas = this.personaSrv.devolverPersonas();
  }

  getCategorias() {
    this.categorias = this.caetegoriaSrv.getCategorias();
  }

  getPovincias() {
    this.provincias = this.provinciaSrv.devolverProvincias();
  }

  getCiudades(idProv) {
    this.ciudades = this.ciudadSrv.devolerCiudadesPorProvincia(idProv);
  }

  getSectores(idCiudad) {
    this.sectores = this.sectorSrv.devolverSectoresPorCiudad(idCiudad);
  }

  changePersona(event) {}
  changeCategoria() {}

  changeProvincia(event) {
    this.getCiudades(event.target.value);
    this.ref.detectChanges();
  }
  changeCiudad(event) {
    this.getSectores(event.target.value);
    //this.editServForm.valid = false;
    this.ref.detectChanges();
  }

  changeSector() {}

  enviar() {
    this.serviceSrv.editarServicio(
      this.servData.id,
      this.editServForm.value["persona"],
      this.editServForm.value["categoria"],
      this.editServForm.value["sector"],
      this.editServForm.value["nombre"],
      this.editServForm.value["descripcion"],
      this.editServForm.value["sitioWeb"],
      this.editServForm.value["fechaCreadoNegocio"],
      this.editServForm.value["callePrincipal"],
      this.editServForm.value["numeracion"],
      this.editServForm.value["calleSecundaria"],      
      this.editServForm.value["detalleAdicional"],
      this.selectedImg
    ).subscribe(res => {
        this.data = res;
        this.presentAlert('Correcto!!!', 'Ha modificado su negocio')
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
