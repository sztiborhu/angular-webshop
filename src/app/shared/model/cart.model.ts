export interface Cart {
  id: string;
  user_email: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[]
  totalPrice: number;
}
