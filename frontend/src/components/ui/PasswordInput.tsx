import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  className?: string
  id?: string
  placeholder?: string
}

export function PasswordInput({ value, onChange, required, className, id, placeholder }: PasswordInputProps) {
  const [show, setShow] = useState(false)

 return (
  <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
    <Input
      id={id} 
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className={`pr-10 ${className ?? ''}`}
      style={{ paddingRight: '2.5rem' }}
    />
    <button
      type="button"
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
      onClick={() => setShow(!show)}
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
)
}