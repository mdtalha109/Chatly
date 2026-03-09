import React from 'react';
import { cn } from '../../../utils/cn';

const Input = React.forwardRef(({
  id,
  label,
  placeholder,
  value,
  onChange,
  className,
  leftAddon,
  style,
  filled,
  bordered = true,
  type = 'text',
  ...rest
}, ref) => {
  const inputStyle = {
    ...style
  };

  return (
    <div className={`input ${className}`} style={inputStyle}>
      {label && <label className="block mb-2 text-xs" htmlFor={`${id}`}>{label}</label>}

      <div className={cn(`relative border flex items-center rounded-md`, filled ? 'bg-gray-100' : 'bg-transparent', bordered ? 'border' : 'border-0')}>


        {leftAddon && (
          <div className="shrink-0 pl-2">
            {leftAddon}
          </div>
        )}

        <input
          id={id}
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(`py-2 px-4 block w-full  outline-none rounded-md text-sm`, filled ? 'bg-gray-100' : 'bg-white')}
          {...rest}
        />
      </div>
    </div>
  );
});

Input.displayName = 'Input'

export default Input;
