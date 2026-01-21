import { createContext } from 'react';
import type { Camiseta } from '../types';

export interface CartItem {
  producto: Camiseta;
  cantidad: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (producto: Camiseta, cantidad?: number) => void;
  removeFromCart: (productoId: number) => void;
  updateQuantity: (productoId: number, cantidad: number) => void;
  clearCart: () => void;
  total: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
