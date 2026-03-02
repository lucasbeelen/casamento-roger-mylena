import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Store } from './pages/Store'
import { Checkout } from './pages/Checkout'
import { Obrigado } from './pages/Obrigado'
import { CartProvider } from './context/CartContext'
import { ScrollToTop } from './components/ScrollToTop'
import './App.css'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loja" element={<Store />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/obrigado" element={<Obrigado />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
