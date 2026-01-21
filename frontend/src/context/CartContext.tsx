import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Camiseta } from '../types';
import { CartContext } from './CartContextDef';
import type { CartItem } from './CartContextDef';
import { camisetaService } from '../services/api';

const CART_KEY = 'cart_items';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(CART_KEY);
    console.log('🔄 Cargando carrito desde localStorage:', stored);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const refrescarPrecios = async () => {
      if (items.length === 0) return;

      try {
        const ids = items.map(item => item.producto.id);
        const camisetasActualizadas = await camisetaService.getByIds(ids);
        
        setItems(prevItems => 
          prevItems.map(item => {
            const actualizada = camisetasActualizadas.find(c => c.id === item.producto.id);
            if (actualizada) {
              console.log('🔄 Actualizando precio:', item.producto.titulo, {
                antes: item.producto.precioInicial,
                ahora: actualizada.precioConDescuento || actualizada.precioInicial,
                tieneDescuento: actualizada.tieneDescuento
              });
              return { ...item, producto: actualizada };
            }
            return item;
          })
        );
        
        console.log('✅ Precios del carrito actualizados con descuentos');
      } catch (error) {
        console.error('Error al actualizar precios del carrito:', error);
      }
    };

    refrescarPrecios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar

  useEffect(() => {
    console.log('💾 Guardando carrito en localStorage:', items);
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (producto: Camiseta, cantidad: number = 1) => {
    console.log('➕ Agregando al carrito:', producto.titulo, 'cantidad:', cantidad);
    
    if (!producto.precioInicial || producto.precioInicial <= 0) {
      console.error('❌ Producto sin precio válido:', producto);
      throw new Error('El producto no tiene un precio válido');
    }

    setItems(prev => {
      const idx = prev.findIndex(i => i.producto.id === producto.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx].cantidad += cantidad;
        console.log('✏️ Producto ya existe, actualizando cantidad a:', updated[idx].cantidad);
        return updated;
      }
      console.log('🆕 Producto nuevo agregado');
      return [...prev, { producto, cantidad }];
    });
  };

  const removeFromCart = (productoId: number) => {
    console.log('🗑️ Eliminando del carrito, ID:', productoId);
    setItems(prev => prev.filter(i => i.producto.id !== productoId));
  };

  const updateQuantity = (productoId: number, cantidad: number) => {
    console.log('🔄 Actualizando cantidad, ID:', productoId, 'nueva cantidad:', cantidad);
    setItems(prev => prev.map(i =>
      i.producto.id === productoId ? { ...i, cantidad } : i
    ));
  };

  const clearCart = () => {
    console.log('🧹 Vaciando carrito');
    setItems([]);
  };

  const total = items.reduce((sum, i) => {
    const precio = i.producto.tieneDescuento && i.producto.precioConDescuento 
      ? i.producto.precioConDescuento 
      : i.producto.precioInicial;
    return sum + precio * i.cantidad;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

