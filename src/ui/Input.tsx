import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-[10px] font-medium text-[#5A6472] tracking-[0.15em] uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={[
            'w-full bg-[#F4F6F8] border text-[#1A1D23] placeholder-[#9CA3AF]',
            'rounded-sm px-4 py-3 text-sm',
            'focus:outline-none transition-colors duration-150',
            error
              ? 'border-[#C62828] focus:border-[#C62828]'
              : 'border-[#D1D9E3] focus:border-[#1666C0]',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {error && <p className="text-xs text-[#C62828]">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
