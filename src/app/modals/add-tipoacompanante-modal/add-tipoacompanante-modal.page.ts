import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { TipoAcompananteSrvService } from 'src/app/services/tipo-acompanante-srv.service';

@Component({
  selector: 'app-add-tipoacompanante-modal',
  templateUrl: './add-tipoacompanante-modal.page.html',
  styleUrls: ['./add-tipoacompanante-modal.page.scss'],
})
export class AddTipoacompananteModalPage implements OnInit {

  @Input() nombre: string;
  inputForm: FormGroup;

  marcaId: number;

  constructor(
    private modalCtrl: ModalController, 
    private navParams: NavParams,
    private tipoAcompananteSrv: TipoAcompananteSrvService,
    private formBuilder: FormBuilder
  ) {
    this.inputForm = this.formBuilder.group({
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl('')
   });
   }

  ngOnInit() {
    this.marcaId = this.navParams.data.marcaId;
  }

  nuevoAcompanante() {
    this.tipoAcompananteSrv.nuevoTipoAcompnanate(this.marcaId, this.inputForm.value["nombre"],
      this.inputForm.value["descripcion"],).subscribe(res => {
        this.dismiss(res);
      },
      (error: any) => {
        this.dismiss(error);
      });
  }

  async dismiss(response: any) {
    const onClosedData: any = response;
    await this.modalCtrl.dismiss(onClosedData);
  }

  async dismissCancelButton() {
    const onClosedData: any = null;
    await this.modalCtrl.dismiss(onClosedData);
  }
  

}
