import React, { useEffect } from 'react';

export default function Adsense({ slot, format = 'auto', isInArticle }) {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);
  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', textAlign: 'center' }}
      data-ad-client="ca-pub-4588610260101909"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
      data-ad-layout={isInArticle ? 'in-article' : undefined}
    />
  );
}
