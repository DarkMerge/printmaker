import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CartService } from './cart/cart.service';
import { CartPanel } from './cart/cart-panel/cart-panel';

@Component({
  imports: [RouterOutlet, CurrencyPipe, CartPanel],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly cart = inject(CartService);
  protected readonly cartOpen = signal(false);

  protected toggleCart() {
    this.cartOpen.update((open) => !open);
  }
}
