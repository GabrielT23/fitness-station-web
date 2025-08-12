'use client'

import React from 'react'

interface Option {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Option[]
  hint?: string
  error?: string | boolean
  className?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, hint, error, className = '', ...props }, ref) => {
    const hasError = !!error
    return (
      <div className="w-full">
        {label && (
          <label className={`block text-sm font-medium mb-1 ${hasError ? 'text-red-600' : 'text-gray-700'}`}>
            {label}
          </label>
        )}

        <select
          ref={ref}
          {...props}
          className={`w-full px-4 py-3 rounded-xl border
            ${hasError ? 'border-red-500 ring-1 ring-red-200' : 'border-gray-200'}
            bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500
            transition-colors ${className}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {hasError ? (
          <p className="text-red-500 text-sm mt-1">{typeof error === 'string' ? error : 'Campo obrigatório'}</p>
        ) : hint ? (
          <p className="text-sm text-gray-500 mt-1">{hint}</p>
        ) : null}
      </div>
    )
  }
)

Select.displayName = 'Select'
