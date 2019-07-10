import React from 'react';
import { Link } from 'gatsby';
import Menu from './menu';
import { DEFAULT_STYLE_LINK } from '../constants';
import { Box, Flex } from 'rebass';

export default function Header({ location }) {
  const { pathname } = location;
  return (
    <Flex
      width="100%"
      p="10px"
      mb="10px"
      alignItems="center"
      css={{
        height: '50px',
        borderBottom: '1px solid #eee',
      }}
    >
      <Box
        flex="1 0 auto"
        ml="20px"
        color="#bbb"
        fontSize="22px"
        css={{
          '@media (max-width: 600px)': {
            marginLeft: 10,
          },
        }}
      >
        <Link css={DEFAULT_STYLE_LINK} to={'/'}>
          bono's blog
        </Link>
      </Box>
      {MENU_DATA.map(item => (
        <Menu
          key={item.pathname}
          pathname={pathname}
          menuPathname={item.pathname}
          menuName={item.title}
        />
      ))}
    </Flex>
  );
}

const MENU_DATA = [
  { pathname: '/programming', title: '개발' },
  { pathname: '/essay', title: '일기' },
  { pathname: '/review', title: '책리뷰' },
  { pathname: '/tags', title: '태그' },
];
