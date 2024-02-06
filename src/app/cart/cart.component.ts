import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgFor } from '@angular/common'; 

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: any[] = [];

constructor(private userService: UserService){

}

ngOnInit(): void {
  this.getCart()
}

getCart(){
  this.userService.getUser().then((user) => {
    console.log('user :', user);
    this.cartItems = user.cart;
  })
  .catch((error: any) => {
    console.log('error :', error);
  });
}

calculateTotalPrice(): number {
  return this.cartItems.reduce((total, item) => total + item.price, 0);
}


removeProduct(product: any): void {
  this.cartItems = this.cartItems.filter(item => item !== product);
  this.userService.removeCartItem(product).then(res => {
    console.log('Product removed from Firestore:', res);
  }).catch(err => {
    console.error('Error removing product from Firestore:', err);
  });
}


}
