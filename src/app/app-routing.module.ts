import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/gaurd/auth.guard';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './orders/orders.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

const routes: Routes = [

  {
    path: '',
    loadChildren: ()=> import('./home/home.module').then((m)=>{ return m.HomeModule})
  },
  {
    path: 'products',
    loadChildren: ()=> import('./product-listing/product-listing.module').then(m=>m.ProductListingModule)
  },
  {
    path: 'account',
    loadChildren:()=> import('./account/account.module').then(m=>m.AccountModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'product/:id',
    loadChildren: ()=> import('./product/product.module').then(m=>m.ProductModule)
  },
  {
    path: 'cart',
    loadChildren: ()=> import('./cart/cart.module').then(m=>m.CartModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'privacy-policy',
    component: PrivacyComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
    // canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top',})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
