import clsx from 'clsx'

const VARIANTS = {
  success: 'bg-success-100 text-success-700 border-success-200',
  warning: 'bg-warning-100 text-warning-700 border-warning-200',
  danger: 'bg-danger-100 text-danger-700 border-danger-200',
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  gray: 'bg-gray-100 text-gray-700 border-gray-200',
  primary: 'bg-primary-100 text-primary-700 border-primary-200'
}

const SIZES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-sm'
}

export default function Badge({ 
  children, 
  variant = 'gray', 
  size = 'md', 
  className = '',
  ...props 
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full border',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}