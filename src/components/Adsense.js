import React from 'react';

export default function Adsense({ slot }) {
  return (
    <div css={{ marginBottom: '20px' }}>
      <ins
        class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-4588610260101909"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
