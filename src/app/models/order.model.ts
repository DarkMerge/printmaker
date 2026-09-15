export interface OrderLine {
  itemId: string;
  name: string;
  imageUrl: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string | null;
  lines: OrderLine[];
  createdAt: unknown;
}

export interface NewOrder {
  customerName: string;
  phone: string | null;
  lines: OrderLine[];
}
