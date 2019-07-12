import { useState, useEffect } from 'react';

export default function useScreenType() {
  const [gte768, setGte768] = useState(getIsScreenBiggerThan768());
  useEffect(() => {
    function handleResize() {
      setGte768(getIsScreenBiggerThan768);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return { gte768 };
}

function getIsScreenBiggerThan768() {
  return window.innerWidth >= 768;
}
