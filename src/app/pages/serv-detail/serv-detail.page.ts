import { Component, OnInit } from '@angular/core';
import { SevicesSrvService } from '../../services/sevices-srv.service';
import { SendObjBtwPagesService } from '../../services/send-obj-btw-pages.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { SmsModalPage } from '../../modals/sms-modal/sms-modal.page';
import { myEnterAnimation } from '../../animations/enter-animation';
import { myLeaveAnimation } from '../../animations/leave-animation';

@Component({
  selector: 'app-serv-detail',
  templateUrl: './serv-detail.page.html',
  styleUrls: ['./serv-detail.page.scss'],
})
export class ServDetailPage implements OnInit {

  nombreSrv: any;

  constructor(
    private servicesSrv: SevicesSrvService, 
    private router: Router, 
    private actRouter: ActivatedRoute, 
    private sendObj: SendObjBtwPagesService, 
    private actionSheetCtrl: ActionSheetController, 
    private callNumber: CallNumber, 
    private sms: SMS,
    private alertCtrl: AlertController, 
    private modalCtrl: ModalController
    ) {       
      this.nombreSrv = sendObj.getObj();
      console.log(this.nombreSrv);
  }

  ngOnInit() {
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Albums',
      backdropDismiss: false,
      buttons: [{
        text: 'Llamar',
        icon: 'call',
        handler: () => {
          console.log('Call clicked');
          this.callNow('+593' + this.nombreSrv.persona.telefono);
        }
      }, {
        text: 'Enviar SMS',
        icon: 'mail',
        handler: () => {
          console.log('Enviar SMS clicked');
          this.presentModal();
        }
      }, {
        text: 'Enviar Mail (open modal)',
        icon: 'mail-open',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  callNow(number) {
    this.callNumber.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: SmsModalPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        'telefono': this.nombreSrv.persona.telefono
      },
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation
    });
    return await modal.present();
  }

}
