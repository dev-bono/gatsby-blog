import React, { useEffect } from 'react';

export default function Adsense({ slot, format = 'auto' }) {
  useEffect(() => {
    if (window.adsbygoogle) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);
  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-4588610260101909"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={'true'}
    />
  );
}
