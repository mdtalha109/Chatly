import React from 'react';

const Input = React.forwardRef(({ label, placeholder, value, onChange, className, style, type = 'text', ...rest }, ref) => {
  const inputStyle = {
    ...style
  };

  return (
    <div className={`input ${className}`} style={inputStyle}>
      {label && <label className="block mb-2 text-xs">{label}</label>}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`py-3 px-4 bg-white block w-full border outline-none rounded-md text-sm border-blue-500 focus:border-2${className}`}
        {...rest}
      />
    </div>
  );
});

Input.displayName = 'Input'

export default Input;
