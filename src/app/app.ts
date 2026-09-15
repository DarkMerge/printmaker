import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CartService } from './cart/cart.service';

@Component({
  imports: [RouterOutlet, CurrencyPipe],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly cart = inject(CartService);
}
