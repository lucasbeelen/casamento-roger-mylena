import { createContext, useContext, useState, type ReactNode } from 'react'
import { siteContent } from '../content/siteContent'

interface CartContextType {
  cart: { [key: number]: number }
  addToCart: (id: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<{ [key: number]: number }>({})

  const addToCart = (id: number) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const current = prev[id] || 0
      if (current <= 1) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: current - 1 }
    })
  }

  const clearCart = () => {
    setCart({})
  }

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)

  const parsePrice = (priceStr: string) => {
    return parseFloat(priceStr.replace('R$', '').replace('.', '').replace(',', '.').trim())
  }

  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = siteContent.giftRegistry.products.find(p => p.id === Number(id))
    if (!product) return sum
    return sum + (parsePrice(product.price) * qty)
  }, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
