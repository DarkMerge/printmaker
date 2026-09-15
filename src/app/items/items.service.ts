import { DestroyRef, inject, Service, signal } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { FIRESTORE } from '../core/firestore';
import { Item, NewItem } from '../models/item.model';

const ITEMS_COLLECTION = 'items';

@Service()
export class ItemsService {
  private readonly firestore = inject(FIRESTORE);

  private readonly itemsSignal = signal<Item[]>([]);
  readonly items = this.itemsSignal.asReadonly();

  constructor() {
    const unsubscribe = onSnapshot(collection(this.firestore, ITEMS_COLLECTION), (snapshot) => {
      this.itemsSignal.set(
        snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as Item),
      );
    });
    inject(DestroyRef).onDestroy(() => unsubscribe());
  }

  addItem(item: NewItem) {
    return addDoc(collection(this.firestore, ITEMS_COLLECTION), item);
  }

  updateItem(id: string, changes: Partial<NewItem>) {
    return updateDoc(doc(this.firestore, ITEMS_COLLECTION, id), changes);
  }

  removeItem(id: string) {
    return deleteDoc(doc(this.firestore, ITEMS_COLLECTION, id));
  }
}
