// components/ui/Input.tsx
'use client'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const Input = ({ label, ...props }: InputProps) => (
  <div className="w-full">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
      {...props}
    />
  </div>
)