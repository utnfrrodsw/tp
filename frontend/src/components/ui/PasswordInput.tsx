import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'


interface PasswordInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  required?: boolean
  className?: string
  id?: string
  placeholder?: string
  autoComplete?: string
}

export function PasswordInput({ value, onChange, onBlur, required, className, id, placeholder, autoComplete }: PasswordInputProps) {
  const [show, setShow] = useState(false)

 return (
  <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
    <Input
      id={id} 
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      required={required}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={`pr-10 ${className ?? ''}`}
      style={{ paddingRight: '2.5rem' }}
    />
    <button
      type="button"
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
      onClick={() => setShow(!show)}
      tabIndex={-1}
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
)
}