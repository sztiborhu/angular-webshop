export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
  categories: string[];
  details: Record<string, string>[];
}
