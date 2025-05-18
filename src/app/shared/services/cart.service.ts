import {inject, Injectable} from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Product } from '../model/product.model';
import { Firestore, collection, doc, setDoc, deleteDoc, getDoc, updateDoc, arrayUnion, onSnapshot } from '@angular/fire/firestore';
import { CartItem } from '../model/cartitem.model';
import {ProductService} from './product.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _snackBar = inject(MatSnackBar);

  private readonly CART_COLLECTION = 'Carts';

  constructor(private firestore: Firestore, private productService: ProductService) {}

  getCartItems(userId: string): Observable<CartItem[]> {
    const cartRef = doc(this.firestore, `${this.CART_COLLECTION}/${userId}`);
    return new Observable<CartItem[]>(observer => {
      const unsubscribe = onSnapshot(cartRef,
        (docSnap) => {
          if (docSnap.exists()) {
            observer.next(docSnap.data()['items'] || []);
          } else {
            observer.next([]);
          }
        },
        (error) => {
          observer.error(error);
        }
      );

      // Return cleanup function
      return () => unsubscribe();
    });
  }

  updateQuantity(userId: string, product: Product, quantity: number = 1): Promise<void> {
    const cartRef = doc(this.firestore, `${this.CART_COLLECTION}/${userId}`);
    return getDoc(cartRef).then(docSnap => {
      const productId = product.id;
      const price = product.price;

      if (product.quantity === 0) {
        this._snackBar.open('Nincs raktáron a termékből!', 'Bezár', {
          duration: 3000,
        });
        return Promise.resolve();
      }

      if (docSnap.exists()) {
        const items = docSnap.data()['items'] || [];
        const existingItemIndex = items.findIndex((item: CartItem) => item.productId === product.id);



        if (existingItemIndex >= 0) {
          items[existingItemIndex].quantity += quantity;

          if (items[existingItemIndex].quantity <= 0) {

            this.removeFromCart(userId, productId);
          }
          if (items[existingItemIndex].quantity > product.quantity) {
            items[existingItemIndex].quantity = product.quantity;
            this._snackBar.open('Elérted a maximális rendelhető mennyiséget!', 'Bezár', {
              duration: 3000,
            });
          } else {
            this._snackBar.open(product!.name + ' hozzáadva a kosárhoz.', 'Bezár', {
              duration: 3000,
            });
          }

          return updateDoc(cartRef, { items });
        } else {

          this._snackBar.open(product!.name + ' hozzáadva a kosárhoz.', 'Bezár', {
            duration: 3000,
          });
          return updateDoc(cartRef, {
            items: arrayUnion({ productId, quantity, price }),
            lastUpdated: new Date()
          });
        }
      } else {
        return setDoc(cartRef, {
          items: [{ productId, quantity, price }],
          lastUpdated: new Date()
        });
      }
    });
  }

  removeFromCart(userId: string, productId: string): Promise<void> {
    const cartRef = doc(this.firestore, `${this.CART_COLLECTION}/${userId}`);
    return getDoc(cartRef).then(docSnap => {
      if (docSnap.exists()) {
        const items = docSnap.data()['items'] || [];
        const updatedItems = items.filter((item: CartItem) => item.productId !== productId);
        return updateDoc(cartRef, {
          items: updatedItems,
          lastUpdated: new Date()
        });
      }
      return Promise.resolve();
    });
  }
  /*
  updateQuantity(userId: string, productId: string, quantity: number): Promise<void> {
    const cartRef = doc(this.firestore, `${this.CART_COLLECTION}/${userId}`);
    return getDoc(cartRef).then(docSnap => {
      if (docSnap.exists()) {
        const items = docSnap.data()['items'] || [];
        const itemIndex = items.findIndex((item: CartItem) => item.productId === productId);

        if (itemIndex >= 0) {
          if (quantity <= 0) {
            return this.removeFromCart(userId, productId);
          } else {
            items[itemIndex].quantity = quantity;
            return updateDoc(cartRef, {
              items,
              lastUpdated: new Date()
            });
          }
        }
      }
      return Promise.resolve();
    });
  }*/

  clearCart(userId: string): Promise<void> {
    const cartRef = doc(this.firestore, `${this.CART_COLLECTION}/${userId}`);
    return deleteDoc(cartRef);
  }

  getCartTotal(userId: string): Observable<number> {
    return this.getCartItems(userId).pipe(
      map(items => items.reduce((total, item) => total + (item.price * item.quantity), 0))
    );
  }

  getCartItemCount(userId: string): Observable<number> {
    return this.getCartItems(userId).pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );
  }

  getCartItem(userId: string, productId: string): Observable<CartItem | undefined> {
    return this.getCartItems(userId).pipe(
      map(items => items.find(item => item.productId === productId))
    );
  }
}
