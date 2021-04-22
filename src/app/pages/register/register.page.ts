import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PersonasSrvService } from '../../services/personas-srv.service';
import { SendObjBtwPagesService } from '../../services/send-obj-btw-pages.service';
import { Observable } from 'rxjs';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  data: any;

  constructor(
    private formBuilder: FormBuilder, 
    private personasSrv: PersonasSrvService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router
    ) { 
    this.registerForm = this.formBuilder.group({
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      cedula: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required)
    }, {
      validator: this.MustMatch('password', 'confirm_password')
    });
  }

  MustMatch(passwor1: string, passwor2: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[passwor1];
        const matchingControl = formGroup.controls[passwor2];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }
        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

  ngOnInit() {
  }

  enviar() {
      this.personasSrv.register(
      this.registerForm.value['nombre'],
      this.registerForm.value['apellido'],
      this.registerForm.value['cedula'],
      this.registerForm.value['telefono'],
      this.registerForm.value['email'],
      this.registerForm.value['password']
      ).subscribe(res => {
        this.data = res;
        this.presentAlert('Ha sido Registrado!!!', 'Por favor ingrese con su correo electronico y contraseña')
      },
      (error: any) => {
          console.log(error);
      });
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  async presentAlert(header, message) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }]
    });

    await alert.present();
  }
}
