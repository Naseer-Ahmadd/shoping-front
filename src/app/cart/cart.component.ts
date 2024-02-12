import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgFor } from '@angular/common'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: any[] = [];
  cartCount: number;
  cartTotalPrice: number;

constructor(private userService: UserService, private toastr: ToastrService){

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
    this.cartItems = user.cart;
  })
  .catch((error: any) => {
    console.log('error :', error);
  });
}

// calculateTotalPrice(): number {
//   return this.cartItems.reduce((total, item) => total + item.price, 0);
// }




removeProduct(product: any): void {
  const itemIndex = this.cartItems.findIndex(item => item === product);

  if (itemIndex !== -1) {
    if (this.cartItems[itemIndex].quantity > 1) {
      // Decrease the quantity if it's greater than 1
      this.cartItems[itemIndex].quantity -= 1;
      this.userService.updateCartItemQuantity(product, this.cartItems[itemIndex].quantity).then(res => {
        this.toastr.warning('Removed 1 quantity');

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


}
