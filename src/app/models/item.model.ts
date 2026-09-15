export interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  count: number;
  price: number;
}

export type NewItem = Omit<Item, 'id'>;
