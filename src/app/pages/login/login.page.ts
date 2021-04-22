import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PersonasSrvService } from '../../services/personas-srv.service';
import { NavController, Events } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { SendObjBtwPagesService } from '../../services/send-obj-btw-pages.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  titulo: String = "Login";
  loginForm: FormGroup;
  data: any;

  constructor(
    private formBuilder: FormBuilder, 
    private personasSrv: PersonasSrvService, 
    private navCtrl: NavController, 
    private sendObj: SendObjBtwPagesService,
    private router: Router,
    private toastCtrl: ToastController,
    private storage: Storage,
    private events: Events
    ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.required)
    });
   }

   ngOnInit() {
  }

  enviar() {
    this.personasSrv.login(
      this.loginForm.value['email'],
      this.loginForm.value['password']
      ).subscribe(res => {
        this.loginForm.reset();
        if(res != null) {
          this.storage.set('user', res).then(() => {
            let a = this.storage.get('user');
          },
          error => console.error('Error storing item', error)
        );
          this.events.publish('user-logged', res);
          this.router.navigateByUrl('/adm-services');
        } else {
          this.presentToast("Login incorrecto.");
        }
      }, 
      (error: any) => {
      });
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
