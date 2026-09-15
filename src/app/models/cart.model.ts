import { Item } from './item.model';

export interface CartLine {
  item: Item;
  quantity: number;
}
