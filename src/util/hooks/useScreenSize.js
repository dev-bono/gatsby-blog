import { useState, useEffect } from 'react';

export default function useScreenSize() {
  const [gte768, setGte768] = useState(false);
  useEffect(() => {
    function handleResize() {
      setGte768(window.innerWidth >= 768);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return { gte768 };
}
