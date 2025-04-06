export interface Order {
  id: string;
  card: boolean;
  user_email: string;
  price: number;
  address: string;
  date: number;
  status: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[]
}
