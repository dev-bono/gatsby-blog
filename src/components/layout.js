import React from 'react';
import { rhythm } from '../utils/typography';
import Header from './header';
import 'prismjs/themes/prism-tomorrow.css';
import '../common.css';

class Template extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <div>
        <Header {...this.props} />
        <div
          className="contents"
          // Header를 제외한 본문의 모든 스타일은 여기서 정의한다.
          css={{
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: rhythm(26),
            padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default Template;
