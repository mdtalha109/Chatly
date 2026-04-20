import { createContext, useContext, useState, useRef, useEffect } from 'react';

const DropDownContext = createContext();

const useDropDown = () => {
  const context = useContext(DropDownContext);
  if (!context) {
    throw new Error('DropDown components must be used within DropDown');
  }
  return context;
};

export const DropDown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <DropDownContext.Provider value={{ isOpen, toggle, close }}>
      <div ref={dropdownRef} className="relative inline-block">
        {children}
      </div>
    </DropDownContext.Provider>
  );
};

const Trigger = ({ children, className = '' }) => {
  const { toggle } = useDropDown();

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  );
};

const Content = ({ children, className = '' }) => {
  const { isOpen } = useDropDown();

  if (!isOpen) return null;

  return (
    <div
      className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 ${className}`}
    >
      {children}
    </div>
  );
};

const Item = ({ children, onClick, className = '' }) => {
  const { close } = useDropDown();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    close();
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${className}`}
    >
      {children}
    </button>
  );
};

DropDown.Trigger = Trigger;
DropDown.Content = Content;
DropDown.Item = Item;

export default DropDown;