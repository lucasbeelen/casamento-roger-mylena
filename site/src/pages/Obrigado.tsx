import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { siteContent } from '../content/siteContent'
import { useCart } from '../context/CartContext'
import { Reveal } from '../components/Reveal'

export function Obrigado() {
  const [searchParams] = useSearchParams()
  const { clearCart } = useCart()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null)

  useEffect(() => {
    const checkPayment = async () => {
      const handle = siteContent.giftRegistry.infinitePay?.handle
      const orderNsu = searchParams.get('order_nsu')
      const transactionNsu = searchParams.get('transaction_nsu')
      const slug = searchParams.get('slug')
      const urlReceipt = searchParams.get('receipt_url')

      if (urlReceipt) {
        setReceiptUrl(urlReceipt)
      }

      if (!handle || !orderNsu || !transactionNsu || !slug) {
        // Se faltar parâmetros, talvez não seja um retorno válido
        console.error('Missing params')
        setStatus('error')
        return
      }

      try {
        const baseUrl = import.meta.env.DEV 
          ? '/infinitepay-api' 
          : 'https://api.infinitepay.io'

        const response = await fetch(`${baseUrl}/invoices/public/checkout/payment_check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                handle,
                order_nsu: orderNsu,
                transaction_nsu: transactionNsu,
                slug: slug
            })
        })

        if (response.ok) {
            const data = await response.json()
            if (data.paid) {
                setStatus('success')
                
                // Envia notificação de compra para o Google Apps Script
                const savedName = localStorage.getItem('pending_purchase_name') || 'Anônimo'
                const savedMessage = localStorage.getItem('pending_purchase_msg') || '-'
                
                // Limpa localStorage
                localStorage.removeItem('pending_purchase_name')
                localStorage.removeItem('pending_purchase_msg')
                
                // URL do Web App do Google Apps Script
                const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-zKoudLK0QDmz61wOlZN5BGkSdYkMNMhSd1YOj5A7BbxbUGephV-RWH65BsfTfoKh/exec'
                
                // Dispara sem await para não bloquear a UI
                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify({
                        type: 'purchase',
                        nome: savedName,
                        mensagem: savedMessage,
                        valor: (data.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                        metodo: data.capture_method
                    })
                }).catch(err => console.error('Erro ao notificar compra:', err))

                clearCart() // Limpa o carrinho pois foi pago
            } else {
                setStatus('error')
            }
        } else {
            setStatus('error')
        }
      } catch (e) {
        console.error(e)
        setStatus('error')
      }
    }

    checkPayment()
  }, [searchParams, clearCart])

  return (
    <div className="app" style={{ minHeight: '100vh', backgroundColor: 'var(--sky)', position: 'relative', overflow: 'hidden' }}>
      {/* Background Doodles */}
      <img src="/conchas.svg" alt="" className="doodle" style={{ top: '10%', left: '-5%', opacity: 0.1, width: 200 }} />
      <img src="/onda.svg" alt="" className="doodle" style={{ bottom: 0, right: 0, opacity: 0.1, width: 400 }} />

      <header className="header" style={{ position: 'sticky', top: 0, backgroundColor: 'rgba(234, 244, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
        <div className="container header__content">
          <Link to="/" className="header__logo" style={{ fontSize: 24, color: 'var(--navy)' }}>R & M</Link>
        </div>
      </header>

      <main className="container" style={{ paddingTop: 80, paddingBottom: 120, textAlign: 'center' }}>
        <Reveal>
          <div style={{ maxWidth: 600, margin: '0 auto', backgroundColor: 'var(--cream)', padding: 40, borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            
            {status === 'loading' && (
              <div>
                <h2 style={{ color: 'var(--navy)', marginBottom: 20 }}>Verificando pagamento...</h2>
                <div className="spinner" style={{ width: 40, height: 40, border: '4px solid rgba(0,0,0,0.1)', borderLeftColor: 'var(--accent)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {status === 'success' && (
              <div>
                <div style={{ fontSize: 60, marginBottom: 20 }}>🎉</div>
                <h1 style={{ color: 'var(--accent)', marginBottom: 20, fontFamily: 'var(--font-heading)' }}>Obrigado pelo Presente!</h1>
                <p style={{ fontSize: 18, color: 'var(--navy)', marginBottom: 30, lineHeight: 1.6 }}>
                  Ficamos muito felizes com seu carinho!<br/>
                  Seu pagamento foi confirmado com sucesso.
                </p>
                
                {receiptUrl && (
                  <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ display: 'inline-block', marginBottom: 20, backgroundColor: '#25D366', color: 'white' }}>
                    Ver Comprovante
                  </a>
                )}
                
                <br/>
                <Link to="/" className="btn btn--outline" style={{ marginTop: 20 }}>
                  Voltar para o Início
                </Link>
              </div>
            )}

            {status === 'error' && (
              <div>
                <div style={{ fontSize: 60, marginBottom: 20 }}>😕</div>
                <h2 style={{ color: 'var(--navy)', marginBottom: 20 }}>Ops! Algo deu errado.</h2>
                <p style={{ color: 'var(--navy-light)', marginBottom: 30 }}>
                  Não conseguimos confirmar o pagamento automaticamente.<br/>
                  Se o valor foi descontado, entre em contato conosco.
                </p>
                <Link to="/checkout" className="btn">
                  Tentar Novamente
                </Link>
              </div>
            )}

          </div>
        </Reveal>
      </main>
    </div>
  )
}
