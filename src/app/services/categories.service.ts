import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Category } from './models/Category';
import { Product } from './models/Product';

// import * as firebase from 'firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
   Category = { }
  
  private db: firebase.firestore.Firestore;
  constructor() {
    this.db = firebase.firestore();
  }

  private get getCategoriesCollection() {
    return this.db.collection('Categories');
  }

  async getCategories(): Promise<Category[]> {
    const snapshot = await this.getCategoriesCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  }

  async getSubCategoryById(categoryId: string): Promise<Category | null> {
    const doc = await this.getCategoriesCollection.doc(categoryId).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as Category) : null;
  }

  async getDocumentsByParentCategoryID(parentCategoryID: number): Promise<Product[]> {
    const querySnapshot = await this.db.collection('Products').where('parentCategoryID', '==', parentCategoryID).limit(10).get();
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const productData = doc.data() as Product;
      products.push(productData);
    });
    return products;
  }
  
  async getDocumentsByChildCategoryID(childCategoryID: number): Promise<Product[]> {
    const querySnapshot = await this.db.collection('Products').where('childCategoryID', '==', childCategoryID).limit(10).get();
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const productData = doc.data() as Product;
      products.push(productData);
    });
    return products;
  }


  async getDocumentByProductID(product_id: number): Promise<Product[]> {
  console.log('product_id :', product_id);
    const querySnapshot = await this.db.collection('Products').where('product_id', '==', product_id).get();
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const productData = doc.data() as Product;
      products.push(productData);
    });
    return products;
  }


}
