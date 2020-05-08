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
  const selected = pathname === menuPathname;
  const textProps = isVertical
    ? {
        my: '15px',
        width: '100vw',
        textAlign: 'center',
        fontSize: selected ? '23px' : '16px',
      }
    : {
        mr: '15px',
        mt: '3px',
        fontSize: '15px',
      };
  return (
    <Box as="li">
      <Link css={DEFAULT_STYLE_LINK} to={menuPathname}>
        <Text
          {...textProps}
          fontWeight={selected ? 700 : 400}
          color={selected ? COLORS.text : COLORS.grey01}
        >
          {menuName}
        </Text>
      </Link>
    </Box>
  );
}
