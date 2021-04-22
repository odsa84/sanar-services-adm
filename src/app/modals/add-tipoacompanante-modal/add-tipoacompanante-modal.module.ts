import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddTipoacompananteModalPage } from './add-tipoacompanante-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AddTipoacompananteModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddTipoacompananteModalPage]
})
export class AddTipoacompananteModalPageModule {}
