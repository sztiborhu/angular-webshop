export interface Order {
  id: string;
  user_id: string;
  total_price: number;
  address: string;
  date: number;
  status: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[]
}
