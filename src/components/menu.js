import React from 'react';
import { Link } from 'gatsby';
import { rhythm } from '../utils/typography';
import { DEFAULT_STYLE_LINK } from '../constants';

export default function Menu({ pathname, menuPathname, menuName }) {
  return (
    <span
      css={{
        ...DEFAULT_STYLT_MENU,
        fontWeight: pathname === menuPathname ? 800 : 300,
      }}
    >
      <Link css={DEFAULT_STYLE_LINK} to={menuPathname}>
        {menuName}
      </Link>
    </span>
  );
}

const DEFAULT_STYLT_MENU = {
  fontSize: rhythm(0.5),
  flex: '0 0 auto',
  marginRight: 15,
  marginTop: 3,
  fontWeight: 300,
  color: '#777',
};
