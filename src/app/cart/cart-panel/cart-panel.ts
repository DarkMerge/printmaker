import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { CartService } from '../cart.service';
import { OrdersService } from '../../orders/orders.service';
import { CheckoutSuccessService } from '../../orders/checkout-success.service';
import { OrderNotificationsService } from '../../orders/order-notifications.service';

@Component({
  selector: 'app-cart-panel',
  imports: [CurrencyPipe, NgOptimizedImage],
  templateUrl: './cart-panel.html',
  styleUrl: './cart-panel.css',
})
export class CartPanel {
  protected readonly cart = inject(CartService);
  private readonly orders = inject(OrdersService);
  private readonly checkoutSuccess = inject(CheckoutSuccessService);
  private readonly notifications = inject(OrderNotificationsService);

  protected readonly submitting = signal(false);

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
      const orderLines = lines.map((line) => ({
        itemId: line.item.id,
        name: line.item.name,
        imageUrl: line.item.imageUrl,
        quantity: line.quantity,
      }));
      const orderNumber = `PM-${Math.floor(1000 + Math.random() * 8999)}`;

      await this.orders.createOrder({ phone: null, lines: orderLines });

      this.cart.clear();
      this.checkoutSuccess.show({
        orderNumber,
        summary: `${count} ${partsWord(count)} у черзі на друк · ${formatMoney(total)}`,
      });
      void this.notifications.notifyNewOrder(orderNumber, orderLines, total);
    } finally {
      this.submitting.set(false);
    }
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
