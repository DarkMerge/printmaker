import { Component, input, output, signal } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Item } from '../../models/item.model';

export interface AddToCartEvent {
  item: Item;
  quantity: number;
}

@Component({
  selector: 'app-item-card',
  imports: [NgOptimizedImage, CurrencyPipe],
  templateUrl: './item-card.html',
  styleUrl: './item-card.css',
})
export class ItemCard {
  readonly item = input.required<Item>();
  readonly addToCart = output<AddToCartEvent>();

  protected readonly quantity = signal(1);

  protected decrement() {
    this.quantity.update((qty) => Math.max(1, qty - 1));
  }

  protected increment() {
    this.quantity.update((qty) => qty + 1);
  }

  protected onAddToCart() {
    this.addToCart.emit({ item: this.item(), quantity: this.quantity() });
  }
}
