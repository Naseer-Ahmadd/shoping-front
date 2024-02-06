import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
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


  updateUserCart(cartItem: any) {
    let userPhone = localStorage.getItem('phone')
    if(userPhone){
      // Retrieve existing user data
      this.getUsers.doc(userPhone).get().then(doc => {
        if (doc.exists) {
          const existingUserData = doc.data() as UserModel;
          
          // Update the cart field with the new cartItem
          existingUserData.cart.push(cartItem);

          // Save the updated user data back to Firestore
          this.getUsers.doc(userPhone?.toString()).set(existingUserData)
            .then(() => {
              console.log('User cart updated in Firestore');
            })
            .catch((error) => {
              console.error('Error updating user cart in Firestore: ', error);
            });
        } else {
          console.error('User document not found in Firestore');
        }
      });
    } else {
      console.error('Phone number not found');
    }
  }


  getUser(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let userPhone = localStorage.getItem('phone');
      if (userPhone) {
        this.getUsers.doc(userPhone).get().then(doc => {
          if (doc.exists) {
            const userData = doc.data();
            resolve(userData);
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


  removeCartItem(product: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let userPhone = localStorage.getItem('phone');
      if (userPhone) {
        this.getUsers.doc(userPhone).get().then(doc => {
          if (doc.exists) {
            const userData = doc.data() as UserModel;
            userData.cart = userData.cart.filter(item => item['product_id'] !== product.product_id);
            this.getUsers.doc(userPhone?.toString()).set(userData)
              .then(() => {
                resolve('Product removed from Firestore');
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
  

}
