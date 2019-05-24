import React from 'react';
import { rhythm } from '../utils/typography';
import Header from './header';
import 'prismjs/themes/prism-tomorrow.css';
import '../common.css';

export default function Template(props) {
  const { children } = props;
  return (
    <div>
      <Header {...props} />
      <div
        className="contents"
        css={{
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: rhythm(16),
          padding: `${rhythm(1.5)} ${rhythm(1 / 2)}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
