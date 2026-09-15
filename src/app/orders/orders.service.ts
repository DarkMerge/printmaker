import { inject, Service } from '@angular/core';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { FIRESTORE } from '../core/firestore';
import { NewOrder } from '../models/order.model';

const ORDERS_COLLECTION = 'orders';

@Service()
export class OrdersService {
  private readonly firestore = inject(FIRESTORE);

  createOrder(order: NewOrder) {
    return addDoc(collection(this.firestore, ORDERS_COLLECTION), {
      ...order,
      createdAt: serverTimestamp(),
    });
  }
}
