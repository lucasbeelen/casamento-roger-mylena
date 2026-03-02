import { useEffect, useRef, useState } from 'react'

type RevealProps = {
  children: React.ReactNode
  className?: string
}

export const Reveal = ({ children, className }: RevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    if (visible) return

    const el = ref.current
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.2 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [visible])

  const cls = ['reveal', visible ? 'is-visible' : '', className ?? ''].filter(Boolean).join(' ')

  return (
    <div ref={ref} className={cls}>
      {children}
    </div>
  )
}

