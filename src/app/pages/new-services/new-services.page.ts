import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
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
import { IonSlides } from '@ionic/angular';

import { finalize } from 'rxjs/operators';
import { SevicesSrvService } from '../../services/sevices-srv.service';
import { Router } from '@angular/router';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-new-services',
  templateUrl: './new-services.page.html',
  styleUrls: ['./new-services.page.scss'],
})
export class NewServicesPage implements OnInit {

  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;

  images = [];
  mainImage: any = null;

  newServForm: FormGroup;
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

  carouselImages = [];
  sliderTwo: any;
  slideOptsTwo = {
    initialSlide: 1,
    slidesPerView: 3,
    loop: false,
    centeredSlides: false,
    spaceBetween: 1
  };

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
    private router: Router,
  ) {
    //this.servData = this.sendServ.getObjServ();
    this.getPersonas();
    this.getCategorias(),
    this.getPovincias();    

    this.newServForm = this.formBuilder.group({
      persona: new FormControl('', Validators.required),
      categoria: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      sitioWeb: new FormControl('', Validators.required),
      fechaCreadoNegocio: new FormControl('', Validators.required),
      callePrincipal: new FormControl(''),
      numeracion: new FormControl(''),
      calleSecundaria: new FormControl(''),
      provincia: new FormControl('', Validators.required),
      ciudad: new FormControl('', Validators.required),
      sector: new FormControl('', Validators.required),
      detalleAdicional: new FormControl('')
    });
  }

  ngOnInit() { }

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
    this.ref.detectChanges();
  }

  changeSector() {}

  enviar() {
    this.serviceSrv.nuevoServicio(
      this.newServForm.value["persona"],
      this.newServForm.value["categoria"],
      this.newServForm.value["sector"],
      this.newServForm.value["nombre"],
      this.newServForm.value["descripcion"],
      this.newServForm.value["sitioWeb"],
      this.newServForm.value["fechaCreadoNegocio"],
      this.newServForm.value["callePrincipal"],
      this.newServForm.value["numeracion"],
      this.newServForm.value["calleSecundaria"],      
      this.newServForm.value["detalleAdicional"],
      this.selectedImg
    ).subscribe(res => {
        this.data = res;
        this.presentSuccessAlert('Correcto!!!', 'Ha creado nuevo negocio')
      },
      (error: any) => {
        this.presentErrorAlert('Error!!!', 'Vuelva a intentarlo')
      });
  }

  async presentSuccessAlert(header, message) {
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
      message: message
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
