import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...rest
}) => {
  const base = 'px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variantClass =
    variant === 'secondary'
      ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      : 'bg-blue-600 text-white hover:bg-blue-500'
  return (
    <button className={`${base} ${variantClass} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export default Button
