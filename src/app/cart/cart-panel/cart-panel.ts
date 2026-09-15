import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { CartService } from '../cart.service';
import { OrdersService } from '../../orders/orders.service';
import { ItemsService } from '../../items/items.service';
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
  private readonly items = inject(ItemsService);

  private readonly checkoutModel = signal({ customerName: '' });
  protected readonly checkoutForm = form(this.checkoutModel, (path) => {
    required(path.customerName, { message: 'Name is required' });
  });

  protected readonly submitting = signal(false);
  protected readonly successVisible = signal(false);
  protected readonly successOrderNumber = signal('');
  protected readonly successSummary = signal('');

  protected readonly countLabel = computed(() => {
    const count = this.cart.totalQuantity();
    if (count === 0) return 'empty';
    return count === 1 ? '1 part' : `${count} parts`;
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
        await this.items.decrementCounts(
          lines.map((line) => ({ itemId: line.item.id, quantity: line.quantity })),
        );
        return undefined;
      });

      if (ok) {
        this.cart.clear();
        this.checkoutModel.set({ customerName: '' });
        this.successOrderNumber.set(`PM-${Math.floor(1000 + Math.random() * 8999)}`);
        this.successSummary.set(
          count === 1
            ? `1 part queued for printing · ${formatMoney(total)}`
            : `${count} parts queued for printing · ${formatMoney(total)}`,
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

function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}
