import React, { useEffect } from 'react';
import { Box } from 'rebass';

export default function OutsideClick({ onClick, children }) {
  useEffect(() => {
    function handleClick() {
      onClick();
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  return (
    <Box
      onClick={e => {
        e.stopPropagation();
      }}
    >
      {children}
    </Box>
  );
}
