import React from 'react';
import { Link } from 'gatsby';
import { DEFAULT_STYLE_LINK } from '../constants';
import { Text } from 'rebass';

export default function Menu({ pathname, menuPathname, menuName }) {
  return (
    <Text
      fontSize="14px"
      fontWeight={pathname === menuPathname ? 700 : 400}
      mr="15px"
      mt="3px"
      color={pathname === menuPathname ? '#555' : '#888'}
    >
      <Link css={DEFAULT_STYLE_LINK} to={menuPathname}>
        {menuName}
      </Link>
    </Text>
  );
}
