import { Link } from 'react-router-dom'
import '../App.css'
import { siteContent } from '../content/siteContent'
import { Reveal } from '../components/Reveal'
import { MusicPlayer } from '../components/MusicPlayer'
import { useCart } from '../context/CartContext'

export function Store() {
  const { cart, addToCart, removeFromCart, totalItems, totalPrice } = useCart()

  const products = siteContent.giftRegistry.products || []

  return (
    <div className="app" style={{ minHeight: '100vh', backgroundColor: 'var(--sky)', position: 'relative', overflow: 'hidden' }}>
      {/* Doodles de Fundo */}
      <img src="/conchas.svg" alt="" className="doodle doodle-shells-rsvp" style={{ top: '10%', left: '-5%', opacity: 0.1, width: 200 }} />
      <img src="/conchas.svg" alt="" className="doodle" style={{ top: '50%', left: '40%', opacity: 0.03, width: 150, transform: 'rotate(45deg)' }} />
      <img src="/cavalomarinho.svg" alt="" className="doodle doodle-seahorse-rsvp" style={{ top: '40%', right: '-2%', opacity: 0.1, width: 180 }} />
      <img src="/cavalomarinho.svg" alt="" className="doodle" style={{ bottom: '25%', left: '20%', opacity: 0.04, width: 120, transform: 'rotate(-15deg)' }} />
      <img src="/coqueiro.svg" alt="" className="doodle" style={{ bottom: '15%', left: '-2%', opacity: 0.05, width: 250, transform: 'rotate(10deg)' }} />
      <img src="/coqueiro.svg" alt="" className="doodle" style={{ top: '15%', right: '30%', opacity: 0.03, width: 180, transform: 'rotate(-5deg)' }} />
      <img src="/onda.svg" alt="" className="doodle" style={{ bottom: 0, right: 0, opacity: 0.1, width: 400 }} />
      <img src="/onda.svg" alt="" className="doodle" style={{ top: '30%', left: '-10%', opacity: 0.05, width: 300, transform: 'rotate(180deg)' }} />
      <img src="/sandalias.svg" alt="" className="doodle" style={{ top: '20%', right: '-3%', opacity: 0.1, width: 160, transform: 'rotate(-20deg)' }} />
      <img src="/sandalias.svg" alt="" className="doodle" style={{ bottom: '50%', right: '45%', opacity: 0.04, width: 100, transform: 'rotate(30deg)' }} />
      <img src="/bolo.svg" alt="" className="doodle" style={{ bottom: '40%', left: '-3%', opacity: 0.08, width: 200 }} />
      <img src="/pratoetalheres.svg" alt="" className="doodle" style={{ top: '60%', right: '5%', opacity: 0.05, width: 150 }} />
      <img src="/pratoetalheres.svg" alt="" className="doodle" style={{ top: '5%', right: '15%', opacity: 0.03, width: 100, transform: 'rotate(15deg)' }} />

      {/* Simple Header */}
      <header className="header" style={{ position: 'sticky', top: 0, backgroundColor: 'rgba(234, 244, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
        <div className="container header__content">
          <Link to="/" className="header__logo" style={{ fontSize: 24, color: 'var(--navy)' }}>R & M</Link>
          <Link to="/" className="btn btn--outline btn--header" style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}>
            ← Voltar ao Site
          </Link>
        </div>
      </header>

      <MusicPlayer 
        src="/tequila.mp3" 
        trackName="Tequila • The Champs" 
        forceAutoplay={true} 
        style={totalItems > 0 ? { bottom: '140px', transition: 'bottom 0.3s ease' } : undefined}
      />

      <main className="container" style={{ paddingTop: 40, paddingBottom: totalItems > 0 ? 240 : 120, transition: 'padding-bottom 0.3s ease' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h1 className="section-title">Lojinha Virtual</h1>
            <p className="section-lede">
              Escolha um ou mais itens para nos presentear! <br/>
              Adicione ao carrinho e finalize enviando a lista para nós.
            </p>
          </div>

          <div className="product-grid">
            {products.map((product) => {
              const qty = cart[product.id] || 0
              return (
                <div key={product.id} className="product-card" style={{ border: qty > 0 ? '2px solid var(--accent)' : 'none' }}>
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                  </div>
                  <div className="product-details">
                    <div>
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-price">{product.price}</div>
                    </div>
                    
                    {qty === 0 ? (
                      <button 
                        type="button" 
                        className="btn btn--outline" 
                        style={{ width: '100%', borderColor: 'var(--accent)', color: 'var(--accent)' }}
                        onClick={() => addToCart(product.id)}
                      >
                        Adicionar
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                        <button 
                          className="btn" 
                          style={{ width: 40, height: 40, padding: 0, borderRadius: '50%' }}
                          onClick={() => removeFromCart(product.id)}
                        >
                          -
                        </button>
                        <span style={{ fontSize: 18, fontWeight: 'bold', minWidth: 20 }}>{qty}</span>
                        <button 
                          className="btn" 
                          style={{ width: 40, height: 40, padding: 0, borderRadius: '50%' }}
                          onClick={() => addToCart(product.id)}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </main>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
          padding: '20px 0',
          zIndex: 100,
          borderTop: '1px solid #eee'
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--navy-light)' }}>
                Total do Carrinho
              </div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>
                {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>
            
            <Link 
              to="/checkout" 
              className="btn"
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            >
              Finalizar Compra
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
