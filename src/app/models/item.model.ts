export interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
}

export type NewItem = Omit<Item, 'id'>;
