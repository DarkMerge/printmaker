import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { CartService } from '../cart.service';
import { OrdersService } from '../../orders/orders.service';
import { OrderSuccess } from '../../orders/order-success/order-success';

@Component({
  selector: 'app-cart-panel',
  imports: [FormField, CurrencyPipe, OrderSuccess],
  templateUrl: './cart-panel.html',
  styleUrl: './cart-panel.css',
})
export class CartPanel {
  protected readonly cart = inject(CartService);
  private readonly orders = inject(OrdersService);

  private readonly checkoutModel = signal({ customerName: '' });
  protected readonly checkoutForm = form(this.checkoutModel, (path) => {
    required(path.customerName, { message: "Вкажіть ім'я" });
  });

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
      const total = this.cart.total();
      const count = this.cart.totalQuantity();

      const ok = await submit(this.checkoutForm, async (field) => {
        await this.orders.createOrder({
          customerName: field().value().customerName,
          phone: null,
          lines: lines.map((line) => ({
            itemId: line.item.id,
            name: line.item.name,
            imageUrl: line.item.imageUrl,
            quantity: line.quantity,
          })),
        });
        return undefined;
      });

      if (ok) {
        this.cart.clear();
        this.checkoutModel.set({ customerName: '' });
        this.successOrderNumber.set(`PM-${Math.floor(1000 + Math.random() * 8999)}`);
        this.successSummary.set(
          `${count} ${partsWord(count)} у черзі на друк · ${formatMoney(total)}`,
        );
        this.successVisible.set(true);
      }
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
