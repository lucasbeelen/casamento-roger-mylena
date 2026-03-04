import '../App.css'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MusicPlayer } from '../components/MusicPlayer'
import { Reveal } from '../components/Reveal'
import { siteContent } from '../content/siteContent'

export function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpMessage, setRsvpMessage] = useState('')
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Detect scroll for sticky header
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', onScroll)

    // Check if user has already RSVP'd
    const savedRsvp = localStorage.getItem('rsvp_sent')
    if (savedRsvp) {
      setRsvpSubmitted(true)
      setRsvpName(savedRsvp)
    }

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const heroStyle = useMemo(() => ({ ['--hero-photo' as string]: `url('/hero.jpg')` }), [])
  const coupleStyle = useMemo(() => ({ ['--couple-photo' as string]: `url('/gay.jpeg')` }), [])

const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Evita múltiplos cliques
    if (isSubmitting) return
    setIsSubmitting(true)

    // URL do Web App do Google Apps Script
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-zKoudLK0QDmz61wOlZN5BGkSdYkMNMhSd1YOj5A7BbxbUGephV-RWH65BsfTfoKh/exec'
    
    // O Apps Script recebe melhor JSON com text/plain para evitar preflight
    const payload = JSON.stringify({
      nome: rsvpName,
      whatsapp: '',
      pessoas: '',
      obs: rsvpMessage
    })

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: payload
      })

      // alert(`Obrigado, ${rsvpName}! Sua presença foi confirmada e enviada para nossa lista.`)
      setRsvpSubmitted(true)
      localStorage.setItem('rsvp_sent', rsvpName)
      // setRsvpName('')
      // setRsvpMessage('')
      
    } catch (error) {
      console.error('Erro ao enviar RSVP:', error)
      alert('Ops! Houve um erro ao enviar. Tente novamente ou nos avise pelo WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app">
      {/* Sticky Header */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header__content">
          <div className="header__logo">R & M</div>
          <nav className="header__nav">
            <a href="#historia" className="header__link">História</a>
            <a href="#detalhes" className="header__link">O Casamento</a>
            <a href="#cronograma" className="header__link">Cronograma</a>
            <a href={`#${siteContent.giftRegistry.id}`} className="header__link">Presentes</a>
          </nav>
          <a href="#rsvp" className="btn btn--outline btn--header">
            Confirmar Presença
          </a>
        </div>
      </header>

      <MusicPlayer src="/iris.mp3" trackName="Iris • The Goo Goo Dolls" />

      {/* Hero Fullscreen */}
      <div className="hero" style={heroStyle}>
        <div className="hero__content">
          <span className="hero__date">{siteContent.meta.dateLabel} • {siteContent.meta.locationLabel}</span>
          <h1 className="hero__title">{siteContent.meta.names}</h1>
        </div>
      </div>

      {/* História - Com Foto do Casal (couple.png) */}
      <section className="panel panel--sky" id="historia">
        <div className="container">
          <Reveal>
            <div className="split-layout">
              <div>
                <h2 className="section-title" style={{ textAlign: 'left' }}>{siteContent.history.title}</h2>
                <div className="section-lede" style={{ textAlign: 'left', margin: 0 }}>
                  {(siteContent.history.body as readonly string[]).map((paragraph, index) => (
                    <p key={index} style={{ marginBottom: 16 }}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 140 }}>
                 <img src="/couple.jpg" alt="Nós" className="doodle-illustration" style={{ maxWidth: '80%', height: 'auto', borderRadius: 12, boxShadow: 'var(--shadow-sm)', marginTop: 0, position: 'relative', zIndex: 2 }} />
                 <img src="/conchas.svg" alt="" className="doodle doodle--br" style={{ width: 120, right: 35, bottom: -20, opacity: 0.3, zIndex: 1 }} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Parallax Photo Band */}
      <div className="parallax-band" style={coupleStyle} aria-label="Foto do casal" />

      {/* Detalhes do Casamento */}
      <section className="panel panel--cream" id="detalhes">
        <div className="container">
          <Reveal>
            <h2 className="section-title">{siteContent.seasideWedding.title}</h2>
            <div className="seaside-features">
              <div className="feature-card feature-card--clean">
                <img src="/coqueiro.svg" alt="" className="feature-icon" />
                <h3 className="feature-title">{siteContent.seasideWedding.features[0].title}</h3>
                <p className="feature-body">{siteContent.seasideWedding.features[0].body}</p>
              </div>
              <div className="feature-card feature-card--clean">
                <img src="/conchas.svg" alt="" className="feature-icon" />
                <h3 className="feature-title">{siteContent.seasideWedding.features[1].title}</h3>
                <p className="feature-body" style={{ whiteSpace: 'pre-line' }}>{siteContent.seasideWedding.features[1].body}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cronograma */}
      <section className="panel panel--sky" id="cronograma" style={{ position: 'relative' }}>
        <img src="/sandalias.svg" alt="" className="doodle doodle-sandals" />
        <img src="/bolo.svg" alt="" className="doodle doodle-cake" />
        
        <div className="container">
          <Reveal>
            <h2 className="section-title">{siteContent.timeline.title}</h2>
            <div className="timeline-clean">
              {siteContent.timeline.items.map((it) => (
                <div className="timeline-row" key={it.time}>
                  <div className="timeline-time">{it.time}</div>
                  <div className="timeline-desc">{it.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gift Registry - Store Layout */}
      <section className="panel panel--sky" id={siteContent.giftRegistry.id}>
        <div className="container">
          <Reveal>
            <h2 className="section-title">{siteContent.giftRegistry.title}</h2>
            <div className="section-lede">
              {siteContent.giftRegistry.paragraphs.map((p, i) => (
                <p key={i} style={{ marginBottom: 12 }}>{p}</p>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 60 }}>
              <Link to="/loja" className="btn btn--submit" style={{ display: 'inline-flex', padding: '16px 32px', fontSize: 13, textDecoration: 'none', backgroundColor: 'var(--sky)' }}>
                Ir para Lojinha Virtual 
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="panel panel--cream" id="rsvp" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background Decorations */}
        <img src="/conchas.svg" alt="" className="doodle doodle-shells-rsvp" />
        <img src="/cavalomarinho.svg" alt="" className="doodle doodle-seahorse-rsvp" />
        {/* Noivos removidos daqui para ficar abaixo do footer */}

        <div className="container">
          <Reveal>
            <h2 className="section-title">{siteContent.rsvp.title}</h2>
            <p className="section-lede">{siteContent.rsvp.subtitle}</p>

            <div className="rsvp-section">
              {rsvpSubmitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--navy)' }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>🎉</div>
                  <h3 style={{ fontSize: 24, marginBottom: 12 }}>Obrigado, {rsvpName}!</h3>
                  <p>Sua presença foi confirmada com sucesso.</p>
                </div>
              ) : (
                <form className="rsvp-form" onSubmit={handleRsvpSubmit}>
                  <div className="form-group">
                    <label className="form-label">Nome Completo</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Digite seu nome aqui" 
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Mensagem aos Noivos (Opcional)</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Deixe um recadinho carinhoso..."
                      value={rsvpMessage}
                      onChange={(e) => setRsvpMessage(e.target.value)}
                    />
                  </div>

                  <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <button 
                      type="submit" 
                      className="btn btn--submit"
                      disabled={isSubmitting}
                      style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'wait' : 'pointer' }}
                    >
                      {isSubmitting ? 'Enviando...' : 'Confirmar Presença'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <Reveal>
            <p className="footer-note">{siteContent.footer.note}</p>
            <div className="footer-contact" style={{ color: 'var(--navy-light)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {siteContent.footer.contactLine}
            </div>
            
            {/* Ilustração Noivos - Abaixo de tudo */}
            <div style={{ marginTop: 60, opacity: 0.8, position: 'relative', zIndex: 10 }}>
              <img src="/noivos.svg" alt="Noivos" width={300} style={{ maxWidth: '80%' }} />
            </div>
          </Reveal>
        </div>
      </footer>
    </div>
  )
}
