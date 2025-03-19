// components/ui/Select.tsx
'use client'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Array<{ value: string; label: string }>
}

export const Select = ({ label, options, ...props }: SelectProps) => (
  <div className="w-full">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)