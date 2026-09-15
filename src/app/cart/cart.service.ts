import { computed, Service, signal } from '@angular/core';
import { CartLine } from '../models/cart.model';
import { Item } from '../models/item.model';

@Service()
export class CartService {
  private readonly linesSignal = signal<CartLine[]>([]);
  readonly lines = this.linesSignal.asReadonly();

  readonly totalQuantity = computed(() =>
    this.lines().reduce((sum, line) => sum + line.quantity, 0),
  );

  readonly subtotal = computed(() =>
    this.lines().reduce((sum, line) => sum + line.item.price * line.quantity, 0),
  );

  add(item: Item, quantity = 1) {
    this.linesSignal.update((lines) => {
      const existing = lines.find((line) => line.item.id === item.id);
      if (!existing) {
        return [...lines, { item, quantity }];
      }
      return lines.map((line) =>
        line.item.id === item.id ? { ...line, quantity: line.quantity + quantity } : line,
      );
    });
  }

  decrement(itemId: string) {
    this.linesSignal.update((lines) =>
      lines.flatMap((line) => {
        if (line.item.id !== itemId) {
          return [line];
        }
        return line.quantity > 1 ? [{ ...line, quantity: line.quantity - 1 }] : [];
      }),
    );
  }

  remove(itemId: string) {
    this.linesSignal.update((lines) => lines.filter((line) => line.item.id !== itemId));
  }

  clear() {
    this.linesSignal.set([]);
  }
}
