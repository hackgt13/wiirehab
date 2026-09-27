import { type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'outline' | 'ghost' | 'accent'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-[#1666C0] text-white font-semibold hover:bg-[#1255A3] active:bg-[#0E4589]',
  outline: 'border border-[#B8C4CE] text-[#1A1D23] hover:border-[#1666C0] hover:text-[#1666C0]',
  ghost:   'text-[#5A6472] hover:text-[#1A1D23] hover:bg-[#DDE2E8]',
  accent:  'bg-[#1666C0] text-white font-semibold hover:bg-[#1255A3]',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center tracking-wide',
        'rounded-sm transition-colors duration-150 cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
