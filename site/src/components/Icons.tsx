import type { ReactNode } from 'react'

type IconProps = {
  className?: string
  title?: string
}

const Svg = ({ className, title, children }: IconProps & { children: ReactNode }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={title ? undefined : true}
    role={title ? 'img' : undefined}
  >
    {title ? <title>{title}</title> : null}
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </g>
  </svg>
)

export const PalmIcon = (props: IconProps) => (
  <Svg {...props}>
    {/* Ilha */}
    <path d="M10 80 Q 50 60 90 80" />
    {/* Palmeira Tronco */}
    <path d="M50 70 Q 55 50 50 30" />
    {/* Folhas */}
    <path d="M50 30 Q 30 10 20 30" />
    <path d="M50 30 Q 70 10 80 30" />
    <path d="M50 30 Q 30 40 20 50" />
    <path d="M50 30 Q 70 40 80 50" />
    <path d="M50 30 Q 50 10 50 5" />
    {/* Sol */}
    <circle cx="80" cy="20" r="8" />
  </Svg>
)

export const PlateIcon = (props: IconProps) => (
  <Svg {...props}>
    {/* Prato */}
    <circle cx="50" cy="50" r="25" />
    <circle cx="50" cy="50" r="15" />
    {/* Garfo */}
    <path d="M15 30 V 70" />
    <path d="M10 30 Q 15 40 20 30" />
    <path d="M15 30 V 25" />
    {/* Faca */}
    <path d="M85 25 V 70" />
    <path d="M85 25 Q 80 30 85 40" />
    {/* Colher */}
    <path d="M92 25 Q 98 25 98 35 Q 98 45 92 45 V 70" />
  </Svg>
)

export const StarfishIcon = (props: IconProps) => (
  <Svg {...props}>
    {/* Estrela */}
    <path d="M30 40 L 40 42 L 45 32 L 50 42 L 60 40 L 52 50 L 55 60 L 45 55 L 35 60 L 38 50 Z" />
    {/* Concha */}
    <path d="M70 70 Q 90 50 70 30 Q 50 50 70 70" />
    <path d="M70 70 L 65 80 L 75 80 Z" />
    <path d="M70 30 L 70 70" />
    <path d="M70 70 Q 80 50 70 30" />
    <path d="M70 70 Q 60 50 70 30" />
  </Svg>
)

export const CloseIcon = (props: IconProps) => (
  <svg
    className={props.className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={props.title ? undefined : true}
    role={props.title ? 'img' : undefined}
  >
    {props.title ? <title>{props.title}</title> : null}
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
