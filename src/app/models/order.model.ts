export interface OrderLine {
  itemId: string;
  name: string;
  imageUrl: string;
  quantity: number;
}

export interface Order {
  id: string;
  phone: string | null;
  lines: OrderLine[];
  createdAt: unknown;
}

export interface NewOrder {
  phone: string | null;
  lines: OrderLine[];
}
