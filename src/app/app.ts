import { Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CartService } from './cart/cart.service';
import { CartPanel } from './cart/cart-panel/cart-panel';
import { CheckoutSuccessService } from './orders/checkout-success.service';
import { OrderSuccess } from './orders/order-success/order-success';

@Component({
  imports: [RouterOutlet, CurrencyPipe, CartPanel, OrderSuccess],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly cart = inject(CartService);
  protected readonly checkoutSuccess = inject(CheckoutSuccessService);

  protected readonly cartOpen = signal(false);
  private readonly cartAnchor = viewChild<ElementRef<HTMLElement>>('cartAnchor');

  constructor() {
    const onDocumentClick = (event: MouseEvent) => {
      if (!this.cartOpen()) {
        return;
      }
      const anchor = this.cartAnchor()?.nativeElement;
      if (anchor && !anchor.contains(event.target as Node)) {
        this.cartOpen.set(false);
      }
    };
    document.addEventListener('click', onDocumentClick);
    inject(DestroyRef).onDestroy(() => document.removeEventListener('click', onDocumentClick));
  }

  protected toggleCart() {
    this.cartOpen.update((open) => !open);
  }

  protected onCheckoutSuccessDismissed() {
    this.checkoutSuccess.clear();
    this.cartOpen.set(false);
  }
}
