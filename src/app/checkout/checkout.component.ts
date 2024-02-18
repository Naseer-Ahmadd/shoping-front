import { Component, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
const _ = require('lodash');

declare var $: any;
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  @ViewChild('confirmationModal') confirmModal: NgbModalRef;
  @ViewChild('upgradePlan') upgradePlan: NgbModalRef;

  ModelReference: NgbModalRef;

  orderItems:any
  cartCount: number;
  cartTotalPrice: number;

    // 
  constructor(private ngbModalService: NgbModal,private userService: UserService,private toastrService: ToastrService){
    try {
      this.orderItems = JSON.parse(localStorage.getItem('order') || '')
    } catch (error) {
        return;
    }
    this.userService.getCartCount()
    this.userService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });
    this.userService.cartTotalPrice$.subscribe((totalPrice) => {
      this.cartTotalPrice = totalPrice;
    });

  }

  ngOnInit(): void {


  }

  openConfirmation(modal){
   this.ModelReference = this.ngbModalService.open(this.confirmModal);
  }
  confirmOrder() {
    if(!this.cartCount){
      this.toastrService.warning('Please add your products to cart then proceed');
      this.ModelReference.close()
      return
    }
    if(!_.isEmpty(this.orderItems)){
      this.userService.createOrder(this.orderItems).then(res=>{
      console.log('res :', res);
        this.ModelReference.close()
        this.toastrService.success('Order Confirmed Successfully!');
        let cartItems = {
          removeAll: true,
          products: this.orderItems
        }
        this.userService.removeCartItem(cartItems).then(res => {
        localStorage.removeItem('order')
        this.orderItems = []
        this.userService.getCartCount()
        }).catch(err => {
          console.error('Error removing product from Firestore:', err);
        });
      })
    }

  }


}