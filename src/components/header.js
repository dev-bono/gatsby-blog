import React from 'react'
import { Link } from 'gatsby'
import { rhythm, scale } from '../utils/typography'
import Menu from './menu'
import { DEFAULT_STYLE_LINK } from '../constants'

class Header extends React.Component {
  render() {
    const { location, children } = this.props
    const { pathname } = location
    return (
      <div
        style={{
          height: '50px',
          widht: '100%',
          borderBottom: '1px solid #eee',
          padding: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            marginBottom: rhythm(1.5),
          }}
        >
          <span
            style={{
              ...scale(0.25),
              flex: '1 0 auto',
              color: '#bbb',
              marginLeft: 20,
            }}
          >
            <Link style={DEFAULT_STYLE_LINK} to={'/'}>
              bono's blog
            </Link>
          </span>
          <Menu
            pathname={location.pathname}
            menuPathname="/programming"
            menuName="개발"
          />
          <Menu
            pathname={location.pathname}
            menuPathname="/essay"
            menuName="일기"
          />
          <Menu
            pathname={location.pathname}
            menuPathname="/review"
            menuName="책리뷰"
          />
          <Menu
            pathname={location.pathname}
            // menuPathname="/tags"
            menuPathname="/"
            menuName="태그"
          />
        </div>
      </div>
    )
  }
}

export default Header
