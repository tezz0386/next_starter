// Global/shared types
export type ID = string | number;

export interface Product {
  id: string;
  name: string;
  price: number;
  createdAt?: string;
  description?: string;
}
