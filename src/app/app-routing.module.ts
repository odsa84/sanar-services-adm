import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'index', loadChildren: './pages/index/index.module#IndexPageModule' },
  { path: 'services-pg', loadChildren: './pages/services-pg/services-pg.module#ServicesPgPageModule' },
  { path: 'images-work', loadChildren: './pages/images-work/images-work.module#ImagesWorkPageModule' },
  { path: 'serv-detail', loadChildren: './pages/serv-detail/serv-detail.module#ServDetailPageModule' },
  { path: 'sms-modal', loadChildren: './modals/sms-modal/sms-modal.module#SmsModalPageModule' },
  { path: 'categories', loadChildren: './pages/categories/categories.module#CategoriesPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'adm-services', loadChildren: './pages/adm-services/adm-services.module#AdmServicesPageModule' },
  { path: 'edit-services', loadChildren: './pages/edit-services/edit-services.module#EditServicesPageModule' },
  { path: 'new-services', loadChildren: './pages/new-services/new-services.module#NewServicesPageModule' },
  { path: 'lst-products', loadChildren: './pages/lst-products/lst-products.module#LstProductsPageModule' },
  { path: 'new-products', loadChildren: './pages/new-products/new-products.module#NewProductsPageModule' },
  { path: 'lst-pedidos', loadChildren: './pages/lst-pedidos/lst-pedidos.module#LstPedidosPageModule' },
  { path: 'cuenta', loadChildren: './pages/cuenta/cuenta.module#CuentaPageModule' },
  { path: 'tablinks', loadChildren: './pages/tablinks/tablinks.module#TablinksPageModule' },
  { path: 'edit-products', loadChildren: './pages/edit-products/edit-products.module#EditProductsPageModule' },
  { path: 'view-products', loadChildren: './pages/view-products/view-products.module#ViewProductsPageModule' },
  { path: 'new-acompanante', loadChildren: './pages/new-acompanante/new-acompanante.module#NewAcompanantePageModule' },
  { path: 'add-tipoacompanante-modal', loadChildren: './modals/add-tipoacompanante-modal/add-tipoacompanante-modal.module#AddTipoacompananteModalPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
