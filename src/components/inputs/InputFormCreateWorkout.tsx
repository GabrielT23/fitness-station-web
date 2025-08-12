'use client'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string | boolean
  className?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className = '', ...props }, ref) => {
    const hasError = !!error
    return (
      <div className="w-full">
        {label && (
          <label
            className={`block text-sm font-medium mb-1 ${hasError ? 'text-red-600' : 'text-gray-700'}`}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          {...props}
          className={`w-full px-4 py-3 rounded-xl border
            ${hasError ? 'border-red-500 ring-1 ring-red-200' : 'border-gray-200'}
            bg-white shadow-sm placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500
            transition-colors ${className}`}
        />

        {hasError ? (
          <p className="text-red-500 text-sm mt-1">{typeof error === 'string' ? error : 'Campo obrigatório'}</p>
        ) : hint ? (
          <p className="text-sm text-gray-500 mt-1">{hint}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
