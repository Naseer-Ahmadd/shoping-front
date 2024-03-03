import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgFor, NgIf } from '@angular/common'; 
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor , NgIf],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: any[] = [];
  cartCount: number;
  cartTotalPrice: number;
  userAddress: any;
  user:any;

constructor(private router: Router, private userService: UserService, private toastr: ToastrService){

}

ngOnInit(): void {
  this.getCart()
  this.userService.getCartCount()
  this.userService.cartCount$.subscribe((count) => {
    this.cartCount = count;
  });

  this.userService.cartTotalPrice$.subscribe((totalPrice) => {
    this.cartTotalPrice = totalPrice;
  });
}

getCart(){
  this.userService.getUser().then((user) => {
  // console.log('user :', user);
    this.cartItems = user.cart;
    this.userAddress = user.userLocation
    this.user = user
  })
  .catch((error: any) => {
    console.log('error :', error);
  });
}

// calculateTotalPrice(): number {
//   return this.cartItems.reduce((total, item) => total + item.price, 0);
// }


updateQuantity(product: any, decrease: any): void {
  const itemIndex = this.cartItems.findIndex(item => item === product);
  if (itemIndex !== -1) {
    if (this.cartItems[itemIndex].quantity == 1 && !decrease) {
      this.cartItems[itemIndex].quantity += 1;
      this.toastr.success('Added 1 quantity');
      this.userService.updateCartItemQuantity(product, this.cartItems[itemIndex].quantity).then(res => {
        this.getCart()
        this.userService.getCartCount()
      }).catch(err => {
        console.error('Error updating product quantity in Firestore:', err);
      });
    } else if(this.cartItems[itemIndex].quantity > 1){
      if (decrease) {
        this.cartItems[itemIndex].quantity -= 1;
        this.toastr.warning('Removed 1 quantity');
      } else {
        this.cartItems[itemIndex].quantity += 1;
        this.toastr.success('Added 1 quantity');
      }
      this.userService.updateCartItemQuantity(product, this.cartItems[itemIndex].quantity).then(res => {
        this.getCart()
        this.userService.getCartCount()
      }).catch(err => {
        console.error('Error updating product quantity in Firestore:', err);
      });
    } else {
      // Remove the entire item if the quantity is 1 or less
      this.cartItems.splice(itemIndex, 1);
      this.userService.removeCartItem(product).then(res => {
        this.toastr.warning('Removed product from cart');
        this.userService.getCartCount()
      }).catch(err => {
        console.error('Error removing product from Firestore:', err);
      });
    }
  }
}


  placeOrder(){

    // console.log(' this.cartItems:', this.cartItems.length);
    // console.log('cart :',this.cartItems );
    const userPhone = localStorage.getItem('phone');

    if(this.cartItems.length){
      let order = {
        user_id: userPhone,
        order_id: 'GE'+Math.floor(100000 + Math.random() * 900000),
        user_address: this.userAddress,
        orderDate: new Date(),
        status: "Pending",
        delivery_by: 'Tomorrow',
        items: this.cartItems,
        totalPrice: this.cartTotalPrice,
        name: this.user.name,
        email: this.user.email
      }
      localStorage.setItem('order', JSON.stringify(order))
      this.router.navigate(['checkout'])
    }else{
      this.toastr.warning('Please add products to cart');
    }
  }

}


