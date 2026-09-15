import { Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-item-card',
  imports: [NgOptimizedImage],
  template: `
    <article class="item-card">
      <img [ngSrc]="item().imageUrl" width="300" height="225" style="object-fit: contain" [alt]="item().name" />
      <h3>{{ item().name }}</h3>
      @if (item().description) {
        <p class="description">{{ item().description }}</p>
      }
      <p class="stock">In stock: {{ item().count }}</p>
      <button type="button" [disabled]="item().count <= 0" (click)="addToCart.emit(item())">
        Add to cart
      </button>
    </article>
  `,
  styles: `
    .item-card {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
    }

    .item-card img {
      width: 100%;
      height: auto;
      aspect-ratio: 4 / 3;
      background: #f4f4f4;
      border-radius: 0.25rem;
    }

    .description {
      color: #555;
      font-size: 0.9rem;
    }

    .stock {
      font-size: 0.85rem;
      color: #777;
    }
  `,
})
export class ItemCard {
  readonly item = input.required<Item>();
  readonly addToCart = output<Item>();
}
