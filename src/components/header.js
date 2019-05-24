import React from 'react';
import { Link } from 'gatsby';
import { rhythm, scale } from '../utils/typography';
import Menu from './menu';
import { DEFAULT_STYLE_LINK } from '../constants';

export default function Header({ location }) {
  const { pathname } = location;
  return (
    <div
      css={{
        height: rhythm(1.7),
        widht: '100%',
        borderBottom: '1px solid #eee',
        padding: 10,
      }}
    >
      <div
        css={{
          display: 'flex',
          width: '100%',
          marginBottom: rhythm(1.5),
        }}
      >
        <span
          css={{
            ...scale(0.25),
            flex: '1 0 auto',
            color: '#bbb',
            marginLeft: 10,
          }}
        >
          <Link css={DEFAULT_STYLE_LINK} to={'/'}>
            bono's blog
          </Link>
        </span>
        {MENU_DATA.map(item => (
          <Menu
            key={item.pathname}
            pathname={pathname}
            menuPathname={item.pathname}
            menuName={item.title}
          />
        ))}
      </div>
    </div>
  );
}

const MENU_DATA = [
  { pathname: '/programming', title: '개발' },
  { pathname: '/essay', title: '일기' },
  { pathname: '/review', title: '책리뷰' },
  { pathname: '/tags', title: '태그' },
];
