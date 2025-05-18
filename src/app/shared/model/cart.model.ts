import {CartItem} from './cartitem.model';

export interface Cart {
  user_id: string;
  items: CartItem[]
  totalPrice: number;
}
