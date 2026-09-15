import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { CartService } from '../cart.service';
import { OrdersService } from '../../orders/orders.service';
import { OrderSuccess } from '../../orders/order-success/order-success';

@Component({
  selector: 'app-cart-panel',
  imports: [CurrencyPipe, NgOptimizedImage, OrderSuccess],
  templateUrl: './cart-panel.html',
  styleUrl: './cart-panel.css',
})
export class CartPanel {
  protected readonly cart = inject(CartService);
  private readonly orders = inject(OrdersService);

  protected readonly submitting = signal(false);
  protected readonly successVisible = signal(false);
  protected readonly successOrderNumber = signal('');
  protected readonly successSummary = signal('');

  protected readonly countLabel = computed(() => {
    const count = this.cart.totalQuantity();
    return count === 0 ? 'порожньо' : `${count} ${partsWord(count)}`;
  });

  protected async placeOrder() {
    this.submitting.set(true);
    try {
      const lines = this.cart.lines();
      const total = this.cart.subtotal();
      const count = this.cart.totalQuantity();

      await this.orders.createOrder({
        phone: null,
        lines: lines.map((line) => ({
          itemId: line.item.id,
          name: line.item.name,
          imageUrl: line.item.imageUrl,
          quantity: line.quantity,
        })),
      });

      this.cart.clear();
      this.successOrderNumber.set(`PM-${Math.floor(1000 + Math.random() * 8999)}`);
      this.successSummary.set(`${count} ${partsWord(count)} у черзі на друк · ${formatMoney(total)}`);
      this.successVisible.set(true);
    } finally {
      this.submitting.set(false);
    }
  }

  protected onSuccessDismissed() {
    this.successVisible.set(false);
  }
}

function partsWord(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return 'деталь';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'деталі';
  return 'деталей';
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}
