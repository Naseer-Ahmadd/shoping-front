import { Component, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
const _ = require('lodash');

declare var $: any;
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [NgIf],
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
  orderConfirmed: boolean = false;
  redirectTime: number = 7; // Set your initial time in seconds
  remainingTime: number;
    // 
  constructor(private router: Router, private ngbModalService: NgbModal,private userService: UserService,private toastrService: ToastrService){
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
        const interval = setInterval(() => {
          this.remainingTime = this.redirectTime;
          this.redirectTime--;
          if (this.redirectTime < 0) {
            clearInterval(interval);
            this.router.navigate(['orders']);
          }
        }, 1000);
        this.orderConfirmed = true
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