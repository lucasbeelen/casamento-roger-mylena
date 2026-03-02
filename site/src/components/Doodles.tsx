import type { CSSProperties, PropsWithChildren } from 'react'

type DoodleProps = {
  className?: string
  title?: string
  style?: CSSProperties
}

const Base = ({ className, title, style, children }: PropsWithChildren<DoodleProps>) => (
  <div className={className} style={style} aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {title ? <title>{title}</title> : null}
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  </div>
)

export const ShellDoodle = ({ className, title, style }: DoodleProps) => (
  <Base className={className} title={title} style={style}>
    <path d="M50 140 c20-50 90-50 110 0" />
    <path d="M60 140 c15-40 75-40 90 0" />
    <path d="M80 140 c10-30 40-30 50 0" />
    <path d="M105 90 v50" />
    <path d="M90 100 l15 10 l15-10" />
  </Base>
)

export const WaveDoodle = ({ className, title, style }: DoodleProps) => (
  <Base className={className} title={title} style={style}>
    <path d="M30 110 c20-15 40-15 60 0 s40 15 60 0" />
    <path d="M30 130 c20-15 40-15 60 0 s40 15 60 0" />
    <path d="M40 90 c10-12 20-12 30 0 s20 12 30 0 s20-12 30 0" />
  </Base>
)

export const StarfishDoodle = ({ className, title, style }: DoodleProps) => (
  <Base className={className} title={title} style={style}>
    <path d="M100 50 l12 30 30 6 -24 20 8 32 -26 -18 -26 18 8 -32 -24 -20 30 -6 z" />
    <path d="M100 80 v20" />
    <path d="M85 100 l15 10 15-10" />
  </Base>
)

export const FlipFlopsDoodle = ({ className, title, style }: DoodleProps) => (
  <Base className={className} title={title} style={style}>
    {/* Chinelo Esquerdo */}
    <path d="M60 60 Q 40 60 40 100 Q 40 160 60 160 Q 80 160 80 100 Q 80 60 60 60 Z" />
    <path d="M60 80 L 50 100" />
    <path d="M60 80 L 70 100" />
    {/* Chinelo Direito */}
    <path d="M120 80 Q 100 80 100 120 Q 100 180 120 180 Q 140 180 140 120 Q 140 80 120 80 Z" />
    <path d="M120 100 L 110 120" />
    <path d="M120 100 L 130 120" />
  </Base>
)

export const DoveDoodle = ({ className, title, style }: DoodleProps) => (
  <Base className={className} title={title} style={style}>
    {/* Corpo */}
    <path d="M60 100 Q 80 80 100 90 Q 120 100 140 80" />
    <path d="M140 80 Q 130 90 140 100 Q 150 110 130 120 Q 110 130 90 120" />
    {/* Asa */}
    <path d="M100 90 Q 110 60 140 50 Q 150 70 130 90" />
    {/* Fita */}
    <path d="M140 80 Q 160 70 170 90" />
    <path d="M140 80 Q 150 60 170 70" />
  </Base>
)

export const CoupleDoodle = ({ className, title, style }: DoodleProps) => (
  <Base className={className} title={title} style={style}>
    {/* Noivo */}
    <circle cx="70" cy="60" r="15" />
    <path d="M70 75 V 120 L 60 160" />
    <path d="M70 120 L 80 160" />
    <path d="M55 90 L 45 110" />
    <path d="M85 90 L 95 110" />
    {/* Noiva */}
    <circle cx="120" cy="65" r="15" />
    <path d="M120 80 Q 100 120 90 160 H 150 Q 140 120 120 80" />
    <path d="M105 95 L 95 110" />
    <path d="M135 95 L 145 110" />
    {/* Véu */}
    <path d="M130 60 Q 160 60 160 100 Q 160 140 140 150" />
  </Base>
)
