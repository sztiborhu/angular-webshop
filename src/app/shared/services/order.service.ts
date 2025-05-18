import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../model/order.model';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where, Timestamp, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import {ProductService} from './product.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly ordersCollection = 'Orders';

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private productService: ProductService,
  ) { }

  getOrdersOfUser(userId: string): Observable<Order[]> {
    const ordersRef = collection(this.firestore, this.ordersCollection);
    const q = query(ordersRef, where('user_id', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  getOrderById(id: string): Observable<Order> {
    const orderRef = doc(this.firestore, `${this.ordersCollection}/${id}`);
    return docData(orderRef, { idField: 'id' }) as Observable<Order>;
  }

  createOrder(order: Omit<Order, 'id'>): Promise<void> {
    const ordersRef = collection(this.firestore, this.ordersCollection);
    const orderWithTimestamp = {
      ...order,
      date: Timestamp.fromDate(new Date(order.date))
    };


    const item = order.items;

    for (let i = 0; i < item.length; i++) {
      this.productService.decreaseProductQuantity(item[i].productId, item[i].quantity);
    }

    return addDoc(ordersRef, orderWithTimestamp).then();
  }

  updateOrder(id: string, order: Partial<Order>): Promise<void> {
    const orderRef = doc(this.firestore, `${this.ordersCollection}/${id}`);
    return updateDoc(orderRef, order);
  }

  deleteOrder(id: string): Promise<void> {
    const orderRef = doc(this.firestore, `${this.ordersCollection}/${id}`);
    return deleteDoc(orderRef);
  }


  getAllOrders(): Observable<Order[]> {
    const ordersRef = collection(this.firestore, this.ordersCollection);
    return collectionData(ordersRef, { idField: 'id' }) as Observable<Order[]>;
  }
}
