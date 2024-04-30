import React from 'react'

const Button = ({ children, onClick, className, type='submit', ...rest }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`py-2 px-2 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold outline-2 outline-offset-2 focus:outline-black bg-[#3528a5] text-white hover:bg-blue-600 focus:outline-none  text-sm  ${className}`}
            {...rest}
        >
        
            {children}
        </button>
    )
}
export default Button