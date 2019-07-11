import React from 'react';
import { Link } from 'gatsby';
import Menu from './menu';
import { DEFAULT_STYLE_LINK } from '../constants';
import { Box, Flex, Text } from 'rebass';
import useScreenSize from '../util/hooks/useScreenSize';
import { MENU_DATA } from './layout';
import { COLORS } from './theme';
import styled from 'styled-components';

export default function Header({ location, showMenu, onClickMenu }) {
  const { gte768 } = useScreenSize();
  const { pathname } = location;
  return (
    <Flex
      width="100%"
      p="10px"
      alignItems="center"
      bg="white"
      css={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '50px',
        borderBottom: `1px solid ${COLORS.lightGrey01}`,
        zIndex: 200,
      }}
    >
      <Text
        flex="0 0 auto"
        mr="auto"
        ml="20px"
        mt="3px"
        color="grey01"
        fontSize="22px"
        css={{
          cursor: 'pointer',
          '@media (max-width: 600px)': {
            marginLeft: 10,
          },
        }}
      >
        <Link css={DEFAULT_STYLE_LINK} to={'/'}>
          bono's blog
        </Link>
      </Text>
      {gte768 &&
        MENU_DATA.map(item => (
          <Menu
            key={item.pathname}
            pathname={pathname}
            menuPathname={item.pathname}
            menuName={item.title}
          />
        ))}
      {!gte768 && (
        <Box
          p="5px"
          width="30px"
          onClick={onClickMenu}
          css={{ height: '28px', cursor: 'pointer', overflow: 'hidden' }}
        >
          <Box
            width={showMenu ? '24px' : '20px'}
            pt="2px"
            mb="6px"
            bg="grey01"
            css={{
              transition: 'all 0.4s',
              transform: showMenu ? 'rotateZ(-45deg)' : 'rotateZ(0)',
              transformOrigin: '100% 0',
            }}
          />
          <Box
            width="20px"
            pt="2px"
            mb="6px"
            bg="grey01"
            show={showMenu}
            css={{
              transition: 'transform 0.5s',
              transform: showMenu ? 'scale(0)' : 'scale(1)',
              transformOrigin: '100% 50%',
            }}
          />
          <Box
            width={showMenu ? '24px' : '20px'}
            pt="2px"
            bg="grey01"
            show={showMenu}
            css={{
              transition: 'all 0.4s',
              transform: showMenu ? 'rotateZ(45deg)' : 'rotateZ(0)',
              transformOrigin: '100% 100%',
            }}
          />
        </Box>
      )}
    </Flex>
  );
}
