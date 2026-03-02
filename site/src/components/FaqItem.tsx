import { useId, useState } from 'react'

type FaqItemProps = {
  q: string
  a: string
}

export const FaqItem = ({ q, a }: FaqItemProps) => {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <div className="faqItem">
      <button
        type="button"
        className="faqItem__q"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          border: 0,
          background: 'transparent',
          padding: 0,
          textAlign: 'left',
          font: 'inherit',
          color: 'inherit',
        }}
      >
        <span>{q}</span>
        <span aria-hidden="true" style={{ opacity: 0.6 }}>
          {open ? '−' : '+'}
        </span>
      </button>
      {open ? (
        <p className="faqItem__a" id={id}>
          {a}
        </p>
      ) : null}
    </div>
  )
}

