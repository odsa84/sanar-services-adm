import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { TipoProductoSrvService } from '../../services/tipo-producto-srv.service';

@Component({
  selector: 'app-add-tipoproducto-modal',
  templateUrl: './add-tipoproducto-modal.page.html',
  styleUrls: ['./add-tipoproducto-modal.page.scss'],
})
export class AddTipoproductoModalPage implements OnInit {

  @Input() nombre: string;
  inputForm: FormGroup;

  categoriaId: number;

  constructor(
    private modalCtrl: ModalController, 
    private navParams: NavParams,
    private tipoProductoSrv: TipoProductoSrvService,
    private formBuilder: FormBuilder
  ) {
    this.inputForm = this.formBuilder.group({
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl('')
   });
   }

  ngOnInit() {
    this.categoriaId = this.navParams.data.catId;
  }

  nuevoProducto() {
    this.tipoProductoSrv.nuevoTipoProducto(this.categoriaId, this.inputForm.value["nombre"],
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
