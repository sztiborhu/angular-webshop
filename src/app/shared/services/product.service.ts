import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import { Product } from '../model/product.model';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDoc
} from '@angular/fire/firestore';
import {increment} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsCollection = 'Products';

  constructor(private firestore: Firestore) { }

  getProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, this.productsCollection);
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const productsRef = collection(this.firestore, this.productsCollection);
    const q = query(productsRef, where('categories', 'array-contains', category));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  getProductById(id: string): Observable<Product> {
    const productRef = doc(this.firestore, `${this.productsCollection}/${id}`);
    return docData(productRef, { idField: 'id'} ) as Observable<Product>;
  }

  addProduct(product: Omit<Product, 'id'>): Promise<void> {
    const productsRef = collection(this.firestore, this.productsCollection);
    return addDoc(productsRef, product).then();
  }

  updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const productRef = doc(this.firestore, `${this.productsCollection}/${id}`);
    return updateDoc(productRef, product);
  }

  deleteProduct(id: string): Promise<void> {
    const productRef = doc(this.firestore, `${this.productsCollection}/${id}`);
    return deleteDoc(productRef);
  }

  getProductQuantity(productId: string): Promise<number> {
    const productRef = doc(this.firestore, `${this.productsCollection}/${productId}`);
    return getDoc(productRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Product;
        return data.quantity ?? 0;
      } else {
        return 0;
      }
    });
  }

  // @ts-ignore
  decreaseProductQuantity(productId: string, amount: number = 1): Promise<void> {
    const productRef = doc(this.firestore, `${this.productsCollection}/${productId}`);

    // @ts-ignore
    this.getProductQuantity(productId).then(quantity => {
      if (quantity > 0) {
        const newQuantity = Math.max(0, quantity - amount);
        return updateDoc(productRef, {
          quantity: newQuantity
        });
      }
    })
  }
}
