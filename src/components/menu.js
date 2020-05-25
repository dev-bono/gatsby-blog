import React from 'react';
import { Link } from 'gatsby';
import { DEFAULT_STYLE_LINK } from '../constants';
import { Box, Text } from 'rebass';
import { COLORS } from './theme';

export default function Menu({
  pathname,
  menuPathname,
  menuName,
  isVertical = false,
}) {
  console.log('pathname', pathname);
  console.log('menuPathname', menuPathname);
  const selected = pathname.indexOf(menuPathname) >= 0;
  const boxProps = isVertical
    ? {
        my: '15px',
        width: '100vw',
        fontSize: selected ? '20px' : '16px',
        style: { textAlign: 'center' },
      }
    : {
        mr: '15px',
        mt: '3px',
        fontSize: '16px',
      };
  return (
    <Box as="li" {...boxProps}>
      <Link css={DEFAULT_STYLE_LINK} to={menuPathname}>
        <Text
          as="span"
          fontWeight={selected ? 700 : 400}
          color={selected ? COLORS.text : COLORS.grey01}
        >
          {menuName}
        </Text>
      </Link>
    </Box>
  );
}
