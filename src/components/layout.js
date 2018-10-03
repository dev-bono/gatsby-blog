import React from 'react'
import { rhythm } from '../utils/typography'
import Header from './header'

class Template extends React.Component {
  render() {
    const { children } = this.props
    return (
      <div>
        <Header {...this.props} />
        <div
          className="contents"
          // Header를 제외한 본문의 모든 스타일은 여기서 정의한다.
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: rhythm(24),
            padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
          }}
        >
          {children}
        </div>
      </div>
    )
  }
}

export default Template
