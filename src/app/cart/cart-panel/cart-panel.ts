import { Component, effect, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { CartService } from '../cart.service';
import { OrdersService } from '../../orders/orders.service';

@Component({
  selector: 'app-cart-panel',
  imports: [FormField, NgOptimizedImage],
  templateUrl: './cart-panel.html',
  styleUrl: './cart-panel.css',
})
export class CartPanel {
  protected readonly cart = inject(CartService);
  private readonly orders = inject(OrdersService);

  private readonly checkoutModel = signal({ customerName: '' });
  protected readonly checkoutForm = form(this.checkoutModel, (path) => {
    required(path.customerName, { message: 'Name is required' });
  });

  protected readonly submitting = signal(false);
  protected readonly orderPlaced = signal(false);

  constructor() {
    effect(() => {
      if (this.cart.lines().length > 0) {
        this.orderPlaced.set(false);
      }
    });
  }

  protected async placeOrder() {
    this.orderPlaced.set(false);
    this.submitting.set(true);
    try {
      const ok = await submit(this.checkoutForm, async (field) => {
        await this.orders.createOrder({
          customerName: field().value().customerName,
          phone: null,
          lines: this.cart.lines().map((line) => ({
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
        this.orderPlaced.set(true);
      }
    } finally {
      this.submitting.set(false);
    }
  }
}
