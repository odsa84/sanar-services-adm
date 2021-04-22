import { Component, OnInit, Input } from '@angular/core';
import { SMS } from '@ionic-native/sms/ngx';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-sms-modal',
  templateUrl: './sms-modal.page.html',
  styleUrls: ['./sms-modal.page.scss'],
})
export class SmsModalPage implements OnInit {

  titulo: string = "Enviar mensaje";
  @Input() telefono: string;
  inputForm: FormGroup;

  constructor(private sms: SMS, private modalCtrl: ModalController, private formBuilder: FormBuilder, 
    private androidPermissions: AndroidPermissions) { 
    this.inputForm = new FormGroup({
      textareaName: new FormControl('', Validators.required)
   });
  }

  ngOnInit() {
  }

  sendSMSWithPermissions() {
    if(this.inputForm.valid) {
      let options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
        //intent: 'INTENT' // send SMS with the native android SMS messaging
        intent: '' // send SMS without open any other app
        }
      };
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS).then( result => { 
        if(!result.hasPermission) { 
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS);
        } else {
          this.sms.send(this.telefono, this.inputForm.value['textareaName']).then(function() {
            alert("Mensaje enviado");
          }, function(error) {
            alert("Error al enviar el mensaje");
          });
          this.dismiss();
        }
      }).catch((err) => {
          alert(JSON.stringify(err));
      });
    }
  }

  sendSMS() {
    let options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
      intent: 'INTENT' // send SMS with the native android SMS messaging
      //intent: '' // send SMS without open any other app
      }
    };
    if(this.inputForm.valid) {
      this.sms.send(this.telefono, this.inputForm.value['textareaName'], options).then(function() {
        alert("Mensaje enviado");
      }, function(error) {
        alert("Error al enviar el mensaje");
      });
      this.dismiss();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
