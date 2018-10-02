import React from 'react'
import { Link } from 'gatsby'
import { rhythm, scale } from '../utils/typography'
import Menu from './menu'
import { DEFAULT_STYLE_LINK } from '../constants'

class Header extends React.Component {
  render() {
    const { pathname } = this.props.location
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
          {MENU_DATA.map(item => (
            <Menu
              pathname={pathname}
              menuPathname={item.pathname}
              menuName={item.title}
            />
          ))}
        </div>
      </div>
    )
  }
}

const MENU_DATA = [
  { pathname: '/programming', title: '개발' },
  { pathname: '/essay', title: '일기' },
  { pathname: '/review', title: '책리뷰' },
  { pathname: '/', title: '태그' },
]

export default Header
