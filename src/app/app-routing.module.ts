import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    loadChildren: ()=> import('./home/home.module').then((m)=>{ return m.HomeModule})
  },
  {
    path: 'products',
    loadChildren: ()=> import('./product-listing/product-listing.module').then(m=>m.ProductListingModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top',})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
