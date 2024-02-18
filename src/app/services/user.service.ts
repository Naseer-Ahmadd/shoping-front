import { Injectable, signal } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from './models/Category';
import { UserModel } from './models/User';
import { AngularFireModule } from '@angular/fire/compat';

// import * as firebase from 'firebase';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';  // Import only app from firebase
import 'firebase/compat/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userPhone : string;
  private cartCount = new BehaviorSubject<number>(0);
  private cartTotalPrice = new BehaviorSubject<number>(0);

  cartCount$: Observable<number> = this.cartCount.asObservable();
  cartTotalPrice$: Observable<number> = this.cartTotalPrice.asObservable();

  private db: firebase.firestore.Firestore;
  constructor() {
    firebase.initializeApp(environment.firebaseConfig)

    this.db = firebase.firestore();
  }

  private get getUsers() {
    return this.db.collection('users');
  }
  
  adduser(user){
    if(user.phone ){
    const usersCollection = this.db.collection('users');
    usersCollection.doc(user.phone).set(user)
      .then(() => {
        console.log('User data added to Firestore');
      })
      .catch((error) => {
        console.error('Error adding user data to Firestore: ', error);
      });
  } else {
    console.error('Phone number not found in localStorage');
  }
  }

  updateUserCart(cartItem: any): Promise<void> {
    console.log(' update cart fn called:', );
    return new Promise<void>((resolve, reject) => {
      let userPhone = localStorage.getItem('phone');
      if (userPhone) {
        this.getUsers.doc(userPhone).get().then(doc => {
          if (doc.exists) {
            const existingUserData = doc.data() as UserModel;
            const existingCartItemIndex = existingUserData.cart.findIndex(item => item['product_id'] === cartItem.product_id);
  
            if (existingCartItemIndex !== -1) {
              // If the product is already in the cart, update quantity and price
              existingUserData.cart[existingCartItemIndex]['quantity'] += cartItem.quantity;
            } else {
              // If the product is not in the cart, add it
              existingUserData.cart.push(cartItem);
            }
  
            // Save the updated user data back to Firestore
            this.getUsers.doc(userPhone?.toString()).set(existingUserData)
              .then((res) => {
                console.log('User cart updated in Firestore',res);
                resolve();
              })
              .catch((error) => {
                console.error('Error updating user cart in Firestore: ', error);
                reject(error);
              });
          } else {
            console.error('User document not found in Firestore');
            reject('User document not found in Firestore');
          }
        });
      } else {
        console.error('Phone number not found');
        reject('Phone number not found');
      }
    });
  }

  

  async getUser(): Promise<any> {
    const userPhone = localStorage.getItem('phone');
  
    if (!userPhone) {
      throw new Error("Phone number not found in localStorage");
    }
  
    const doc = await this.getUsers.doc(userPhone).get();
  
    if (doc.exists) {
      return doc.data();
    } else {
      return 'NO_USER'
      throw new Error("User document not found in Firestore");
    }
  }


  removeCartItem(product: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let userPhone = localStorage.getItem('phone');
      if (userPhone) {
        this.getUsers.doc(userPhone).get().then(doc => {
          if (doc.exists) {
            const userData = doc.data() as UserModel;
            if(product.removeAll){
              userData.cart =[]
              this.getUsers.doc(userPhone?.toString()).set(userData)
                .then(() => {
                  resolve('All Product removed from Firestore');
                })
                .catch((error) => {
                  reject('Error removing cart data in Firestore: ' + error);
                });
            }else{
              userData.cart = userData.cart.filter(item => item['product_id'] !== product.product_id);
              console.log('userData :', userData);
              this.getUsers.doc(userPhone?.toString()).set(userData)
                .then(() => {
                  resolve('Product removed from Firestore');
                })
                .catch((error) => {
                  reject('Error updating user data in Firestore: ' + error);
                });
              }
          } else {
            reject("User document not found in Firestore");
          }
        })
        .catch((error) => {
          reject(error);
        });
      } else {
        reject("Phone number not found in localStorage");
      }
    });
  }

  updateCartItemQuantity(product: any, newQuantity: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let userPhone = localStorage.getItem('phone');
      if (userPhone) {
        this.getUsers.doc(userPhone).get().then(doc => {
          if (doc.exists) {
            const userData = doc.data() as UserModel;
            const updatedCart = userData.cart.map(item => {
              if (item['product_id'] === product.product_id) {
                item['quantity'] = newQuantity;
              }
              return item;
            });
  
            userData.cart = updatedCart;
  
            this.getUsers.doc(userPhone?.toString()).set(userData)
              .then(() => {
                resolve('Product quantity updated in Firestore');
              })
              .catch((error) => {
                reject('Error updating user data in Firestore: ' + error);
              });
          } else {
            reject("User document not found in Firestore");
          }
        })
        .catch((error) => {
          reject(error);
        });
      } else {
        reject("Phone number not found in localStorage");
      }
    });
  }

  
  async getCartCount() {
    try {
      const user = await this.getUser();
      console.log('user serr:', user);
  
      // Calculate cart count from the sum of quantities
      const cartCount = user.cart.reduce((count, cartItem) => count + cartItem.quantity, 0);
  
      // Calculate total price from the sum of quantity * price
      const cartTotalPrice = user.cart.reduce((total, cartItem) => total + (cartItem.quantity * cartItem.price), 0);
  
      this.cartCount.next(cartCount);
      this.cartTotalPrice.next(cartTotalPrice);
    } catch (error) {
      console.log('error:', error);
      throw error; // rethrow the error or handle it as needed
    }
  }
  
  private get getOrders() {
    return this.db.collection('orders');
  }


  async createOrder(order): Promise<void> {
    try {
      const ordersCollection = this.db.collection('orders');
      await ordersCollection.add(order);
      // You may want to perform additional actions such as updating inventory, sending confirmation emails, etc.
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  async getMyOrders(): Promise<Order[]> {
    try {
      const userPhone = localStorage.getItem('phone');
      const ordersSnapshot = await this.db.collection('orders').where('user_id', '==', userPhone).get();
      const orders: Order[] = [];
      ordersSnapshot.forEach((doc) => {
        orders.push({ ...doc.data(), orderId: doc.id } as Order);
      });
      return orders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }
}




interface Order {
  orderId?: string;
  userId: string;
  customerName: string;
  shippingAddress: string;
  orderDate: firebase.firestore.Timestamp;
  totalAmount: number;
  items: OrderItem[];
  status: OrderStatus;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

enum OrderStatus {
  Pending = 'Pending',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
}