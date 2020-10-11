import React, { useEffect } from 'react';

export default function OutsideClick({ onClick, children }) {
  useEffect(() => {
    function handleClick() {
      onClick();
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  );
}
