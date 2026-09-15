import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-item-card',
  imports: [NgOptimizedImage, CurrencyPipe],
  templateUrl: './item-card.html',
  styleUrl: './item-card.css',
})
export class ItemCard {
  readonly item = input.required<Item>();
  readonly quantityInCart = input(0);
  readonly addToCart = output<Item>();

  protected readonly soldOut = computed(() => this.item().count <= 0);
  protected readonly maxedOut = computed(() => this.quantityInCart() >= this.item().count);
  protected readonly disabled = computed(() => this.soldOut() || this.maxedOut());

  protected readonly buttonLabel = computed(() => {
    if (this.soldOut()) return 'Sold out';
    if (this.maxedOut()) return 'Max in cart';
    if (this.quantityInCart() > 0) return `Add another · ${this.quantityInCart()}`;
    return 'Add to cart';
  });

  protected readonly stockLabel = computed(() =>
    this.soldOut() ? 'Sold out' : `In stock: ${this.item().count}`,
  );
}
