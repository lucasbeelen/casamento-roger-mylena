import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import { siteContent } from '../content/siteContent'
import { Reveal } from '../components/Reveal'
import { useCart } from '../context/CartContext'
import { MusicPlayer } from '../components/MusicPlayer'

export function Checkout() {
  const { cart, addToCart, removeFromCart, totalPrice } = useCart()
  const [message, setMessage] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const products = siteContent.giftRegistry.products || []
  
  // Filter products that are in the cart
  const cartItems = products.filter(p => cart[p.id] > 0).map(p => ({
    ...p,
    qty: cart[p.id]
  }))

  const parsePrice = (priceStr: string) => {
    return parseFloat(priceStr.replace('R$', '').replace('.', '').replace(',', '.').trim())
  }

  const normalizePhoneBR = (raw: string) => {
    const digits = raw.replace(/\D/g, '')

    if (!digits) return null

    if (digits.startsWith('55') && digits.length >= 12) {
      return `+${digits}`
    }

    if ((digits.length === 10 || digits.length === 11) && !digits.startsWith('0')) {
      return `+55${digits}`
    }

    return null
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const createPaymentLink = async () => {
    setLoading(true)
    setError(null)
    
    const handle = siteContent.giftRegistry.infinitePay?.handle as string | undefined
    if (!handle || handle === 'seahandle') {
        alert('Atenção: Configure o handle da InfinitePay em siteContent.ts')
        setLoading(false)
        return
    }

    if (!buyerName.trim()) {
        alert('Por favor, digite seu nome completo.')
        setLoading(false)
        return
    }

    if (!buyerEmail.trim() || !isValidEmail(buyerEmail.trim())) {
        alert('Por favor, digite um e-mail válido.')
        setLoading(false)
        return
    }

    const normalizedPhone = normalizePhoneBR(buyerPhone)
    if (!normalizedPhone) {
        alert('Por favor, digite um telefone/WhatsApp válido (ex: (82) 99999-9999).')
        setLoading(false)
        return
    }

    const itemsPayload = cartItems.map(item => {
        const price = parsePrice(item.price)
        const priceInCents = Math.round(price * 100)
        return {
            description: item.name,
            quantity: item.qty,
            price: priceInCents,
        }
    })

    const origin = window.location.origin
    const orderNsu = `ORDER-${Date.now()}`

    // Use /api/checkout proxy both in dev and prod
    // In dev: Vite proxy redirects /api/checkout -> InfinitePay
    // In prod: Vercel serverless function handles /api/checkout -> InfinitePay
    const baseUrl = '/api'

    try {
        const response = await fetch(`${baseUrl}/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                handle: handle,
                items: itemsPayload,
                order_nsu: orderNsu,
                redirect_url: `${origin}/obrigado`,
                customer: {
                    name: buyerName.trim(),
                    email: buyerEmail.trim(),
                    phone_number: normalizedPhone
                }
            })
        })

        if (response.ok) {
            const data = await response.json()
            if (data.url) {
                // Save to localStorage so we can retrieve it in Obrigado page
                localStorage.setItem('pending_purchase_msg', message)
                localStorage.setItem('pending_purchase_name', buyerName)
                
                // Salvar lista de presentes
                const presentList = cartItems.map(item => `${item.qty}x ${item.name}`).join(', ')
                localStorage.setItem('pending_purchase_items', presentList)

                window.location.href = data.url
            } else {
                throw new Error('URL de pagamento não retornada')
            }
        } else {
            const errData = await response.json()
            console.error('InfinitePay Error:', errData)
            throw new Error('Falha ao criar link de pagamento')
        }
    } catch (e) {
        console.error(e)
        setError('Não foi possível conectar ao checkout. Tente novamente.')
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="app" style={{ minHeight: '100vh', backgroundColor: 'var(--sky)', position: 'relative', overflow: 'hidden' }}>
      {/* Background Doodles */}
      <img src="/conchas.svg" alt="" className="doodle doodle-shells-rsvp" style={{ top: '10%', left: '-5%', opacity: 0.1, width: 200 }} />
      <img src="/onda.svg" alt="" className="doodle" style={{ bottom: 0, right: 0, opacity: 0.1, width: 400 }} />
      <img src="/sandalias.svg" alt="" className="doodle" style={{ top: '20%', right: '-3%', opacity: 0.1, width: 160, transform: 'rotate(-20deg)' }} />
      <img src="/cavalomarinho.svg" alt="" className="doodle" style={{ bottom: '40%', left: '-5%', opacity: 0.05, width: 150, transform: 'rotate(15deg)' }} />
      <img src="/coqueiro.svg" alt="" className="doodle" style={{ top: '40%', left: '50%', opacity: 0.03, width: 250, transform: 'translate(-50%, -50%) rotate(5deg)' }} />
      <img src="/bolo.svg" alt="" className="doodle" style={{ top: '15%', left: '10%', opacity: 0.05, width: 120, transform: 'rotate(-10deg)' }} />
      <img src="/pratoetalheres.svg" alt="" className="doodle" style={{ bottom: '10%', left: '20%', opacity: 0.04, width: 100 }} />

      {/* Header */}
      <header className="header" style={{ position: 'sticky', top: 0, backgroundColor: 'rgba(234, 244, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
        <div className="container header__content">
          <Link to="/" className="header__logo" style={{ fontSize: 24, color: 'var(--navy)' }}>R & M</Link>
          <Link to="/loja" className="btn btn--outline btn--header" style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}>
            ← Voltar à Loja
          </Link>
        </div>
      </header>

      <MusicPlayer src="/tequila.mp3" trackName="Tequila • The Champs" />

      <main className="container" style={{ paddingTop: 40, paddingBottom: 120 }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 className="section-title">Finalizar Compra</h1>
            <p className="section-lede">
              Revise seus presentes e deixe uma mensagem para nós!
            </p>
          </div>

          <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start', position: 'relative', zIndex: 10 }}>
            {/* Order Summary */}
            <div className="checkout-card" style={{ backgroundColor: 'var(--cream)', padding: 30, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative', zIndex: 10 }}>
              <h3 style={{ marginBottom: 20, color: 'var(--navy)', borderBottom: '1px solid #eee', paddingBottom: 10 }}>Resumo do Pedido</h3>
              
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--navy-light)' }}>
                  Seu carrinho está vazio.
                  <br/>
                  <Link to="/loja" style={{ color: 'var(--accent)', fontWeight: 'bold', marginTop: 10, display: 'inline-block' }}>
                    Voltar para a loja
                  </Link>
                </div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {cartItems.map(item => (
                    <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginRight: 15 }} 
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--navy)', fontSize: 16, marginBottom: 4 }}>{item.name}</div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ fontSize: 14, color: 'var(--navy-light)' }}>
                            {item.price}
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'transparent', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(15, 39, 64, 0.1)' }}>
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--accent)', background: 'transparent', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    -
                                </button>
                                <span style={{ fontSize: 14, fontWeight: 'bold', minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                                <button 
                                    onClick={() => addToCart(item.id)}
                                    style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--accent)', background: 'transparent', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 'bold', color: 'var(--accent)', marginLeft: 10 }}>
                        {(parsePrice(item.price) * item.qty).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </li>
                  ))}
                  <li style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, paddingTop: 10, fontSize: 20, fontWeight: 'bold', color: 'var(--navy)', borderTop: '2px solid rgba(0,0,0,0.05)' }}>
                    <span>Total</span>
                    <span>{totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </li>
                </ul>
              )}
            </div>

            {/* Checkout Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', zIndex: 10 }}>
              <div className="checkout-card" style={{ backgroundColor: 'var(--cream)', padding: 30, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: 20, color: 'var(--navy)' }}>Preencha seus dados</h3>
                
                <div style={{ marginBottom: 15 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: 'var(--navy)' }}>Seu Nome Completo</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Digite seu nome"
                    style={{
                      width: '100%',
                      padding: 12,
                      borderRadius: 8,
                      border: '1px solid rgba(15, 39, 64, 0.2)',
                      backgroundColor: 'transparent',
                      fontFamily: 'inherit',
                      color: 'var(--navy)'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 15 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: 'var(--navy)' }}>Seu E-mail</label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    style={{
                      width: '100%',
                      padding: 12,
                      borderRadius: 8,
                      border: '1px solid rgba(15, 39, 64, 0.2)',
                      backgroundColor: 'transparent',
                      fontFamily: 'inherit',
                      color: 'var(--navy)'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 15 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: 'var(--navy)' }}>Seu WhatsApp</label>
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="(82) 99999-9999"
                    style={{
                      width: '100%',
                      padding: 12,
                      borderRadius: 8,
                      border: '1px solid rgba(15, 39, 64, 0.2)',
                      backgroundColor: 'transparent',
                      fontFamily: 'inherit',
                      color: 'var(--navy)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: 'var(--navy)' }}>Sua Mensagem para os noivos!</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escreva algo especial para nós..."
                    style={{
                      width: '100%',
                      height: 120,
                      padding: 15,
                      borderRadius: 8,
                      border: '1px solid rgba(15, 39, 64, 0.2)',
                      backgroundColor: 'transparent',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      color: 'var(--navy)'
                    }}
                  />
                </div>
              </div>

              <div className="checkout-card" style={{ backgroundColor: 'var(--cream)', padding: 30, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: 20, color: 'var(--navy)' }}>Pagamento</h3>
                <p style={{ marginBottom: 20, fontSize: 14, color: 'var(--navy-light)' }}>
                  Você será redirecionado para o ambiente seguro da InfinitePay.
                  Aceitamos Pix (sem taxas) e Cartão de Crédito.
                </p>
                
                {error && (
                  <div style={{ padding: 15, backgroundColor: '#ffebee', color: '#c62828', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
                    {error}
                  </div>
                )}

                <button
                  onClick={createPaymentLink}
                  disabled={loading || cartItems.length === 0}
                  className="btn"
                  style={{ 
                    width: '100%', 
                    backgroundColor: loading ? '#ccc' : '#25D366', // InfinitePay green is roughly similar, or keep site accent
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10
                  }}
                >
                  {loading ? 'Gerando link...' : 'Pagar com InfinitePay'}
                </button>
                <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: '#aaa' }}>
                  Ambiente Seguro via InfinitePay
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  )
}
