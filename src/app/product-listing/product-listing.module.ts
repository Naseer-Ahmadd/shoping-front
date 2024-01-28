import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductListingRoutingModule } from './product-listing-routing.module';
import { ProductListingComponent } from './product-listing.component';


@NgModule({
  declarations: [ProductListingComponent],
  imports: [
    CommonModule,
    ProductListingRoutingModule
  ]
})
export class ProductListingModule { }
