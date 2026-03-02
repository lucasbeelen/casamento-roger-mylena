import { useEffect, useMemo, useState } from 'react'
import { CloseIcon } from './Icons'

type RsvpModalProps = {
  onClose: () => void
  coupleNames: string
  weddingDateLabel: string
  weddingLocationLabel: string
}

const toWhatsappNumber = (raw: string) => raw.replace(/[^\d]/g, '')

export const RsvpModal = ({
  onClose,
  coupleNames,
  weddingDateLabel,
  weddingLocationLabel,
}: RsvpModalProps) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [guests, setGuests] = useState('0')
  const [notes, setNotes] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const message = useMemo(() => {
    const lines = [
      `RSVP — ${coupleNames}`,
      `Data: ${weddingDateLabel}`,
      `Local: ${weddingLocationLabel}`,
      '',
      `Nome: ${name || '-'}`,
      `Acompanhantes: ${guests}`,
      `WhatsApp: ${phone || '-'}`,
      notes ? `Observações: ${notes}` : null,
    ].filter(Boolean)

    return lines.join('\n')
  }, [coupleNames, guests, name, notes, phone, weddingDateLabel, weddingLocationLabel])

  const canSubmit = name.trim().length >= 2

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setFeedback('Mensagem copiada!')
    } catch {
      setFeedback('Não foi possível copiar. Tente selecionar e copiar manualmente.')
    }
  }

  const onSendWhatsapp = () => {
    const target = import.meta.env.VITE_RSVP_WHATSAPP as string | undefined
    const normalized = target ? toWhatsappNumber(target) : ''

    if (!normalized) {
      setFeedback('Número do WhatsApp não configurado (VITE_RSVP_WHATSAPP).')
      return
    }

    const url = `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) {
      setFeedback('Por favor, informe seu nome.')
      return
    }
    setFeedback('Pronto! Agora envie pelo WhatsApp ou copie a mensagem.')
  }

  return (
    <div
      className="modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-label="Confirmação de presença"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Confirmar Presença (R.S.V.P.)</h2>
          <button type="button" className="iconBtn" onClick={onClose} aria-label="Fechar">
            <CloseIcon />
          </button>
        </div>
        <div className="modal__body">
          <form onSubmit={onSubmit}>
            <div className="formGrid">
              <div className="field">
                <div className="label">Nome Completo</div>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div className="field">
                <div className="label">WhatsApp (Opcional)</div>
                <input
                  className="input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="field">
                <div className="label">Total de Pessoas</div>
                <select className="select" value={guests} onChange={(e) => setGuests(e.target.value)}>
                  {['0', '1', '2', '3', '4', '5', '6+'].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <div className="label">Observações</div>
                <textarea
                  className="textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Restrições alimentares, dúvidas ou recadinho para os noivos..."
                />
              </div>
            </div>
            {feedback ? <div className="muted" style={{ marginTop: 12 }}>{feedback}</div> : null}
            <div className="modal__actions">
              <button type="button" className="btn btnSecondary" onClick={onCopy}>
                Copiar
              </button>
              <button type="submit" className="btn">
                Gerar Mensagem
              </button>
              <button type="button" className="btn" onClick={onSendWhatsapp} disabled={!canSubmit}>
                Enviar no WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

