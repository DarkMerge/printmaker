import { Component, inject } from '@angular/core';
import { ItemsService } from '../items/items.service';
import { CartService } from '../cart/cart.service';
import { ItemCard } from '../items/item-card/item-card';
import { CartPanel } from '../cart/cart-panel/cart-panel';

@Component({
  selector: 'app-shop',
  imports: [ItemCard, CartPanel],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
  protected readonly items = inject(ItemsService);
  protected readonly cart = inject(CartService);
}
