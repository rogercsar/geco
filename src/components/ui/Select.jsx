import React from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({ 
  className, 
  label, 
  error, 
  helperText, 
  placeholder = 'Selecione uma opção',
  options = [],
  children,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="label text-secondary-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          className={clsx(
            'input appearance-none pr-10 cursor-pointer',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-4 w-4 text-secondary-400" />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-secondary-500">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;

