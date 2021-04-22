import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TablinksPage } from './tablinks.page';

const routes: Routes = [
  {
    path: '',
    component: TablinksPage,
    children: [
      {
        path: 'pedidos',
        loadChildren: () => import('../lst-pedidos/lst-pedidos.module').then(m => m.LstPedidosPageModule)
      },
      {
        path: 'productos',
        loadChildren: () => import('../lst-products/lst-products.module').then(m => m.LstProductsPageModule)
      },
      {
        path: 'cuenta',
        loadChildren: () => import('../cuenta/cuenta.module').then(m => m.CuentaPageModule)
      },
      {
        path: '',
        redirectTo: '/tablinks/productos',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TablinksPage]
})
export class TablinksPageModule {}
