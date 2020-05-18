import React, { useState } from 'react';
import { Link } from 'gatsby';
import Menu from './menu';
import { DEFAULT_STYLE_LINK } from '../constants';
import { Box, Flex, Text } from 'rebass';
import useScreenType from '../util/hooks/useScreenType';
import { MENU_DATA } from './layout';
import { COLORS } from './theme';

export default function Header({ location, showMenu, onClickMenu }) {
  const { gte768 } = useScreenType();
  const [inTransition, setInTranstiion] = useState(false);
  const { pathname } = location;
  return (
    <>
      <Flex
        as="header"
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
            {"bono's blog"}
          </Link>
        </Text>
        {gte768 && (
          <Box as="nav">
            <Flex as="ul">
              {MENU_DATA.map((item) => (
                <Menu
                  key={item.pathname}
                  pathname={pathname}
                  menuPathname={item.pathname}
                  menuName={item.title}
                />
              ))}
            </Flex>
          </Box>
        )}
        {!gte768 && (
          <Box
            p="5px"
            width="30px"
            onClick={() => {
              setInTranstiion(true);
              onClickMenu();
            }}
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
      <Box mt="50px" />
      {!gte768 && (
        <Box
          width="100%"
          bg="white"
          as="nav"
          onTransitionEnd={() => setInTranstiion(false)}
          css={{
            borderBottom:
              inTransition || showMenu
                ? `1px solid ${COLORS.lightGrey01}`
                : 'none',
            position: 'fixed',
            left: 0,
            top: '50px',
            zIndex: 100,
            opacity: 0.9,
            maxHeight: showMenu ? '400px' : '0px',
            transition: 'max-height 0.5s ease',
            overflow: 'hidden',
          }}
        >
          <Box m="10px" as="ul">
            {MENU_DATA.map((item) => (
              <Flex
                key={item.pathname}
                justifyContent="center"
                alignItems="center"
              >
                <Menu
                  pathname={location.pathname}
                  menuPathname={item.pathname}
                  menuName={item.title}
                  isVertical={true}
                >
                  {item.title}
                </Menu>
              </Flex>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
}
