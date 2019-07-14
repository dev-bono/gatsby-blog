import React, { useState } from 'react';
import Header from './header';
import '../reset.css';
import 'prismjs/themes/prism-tomorrow.css';
import '../common.css';
import { Box, Flex } from 'rebass';
import { ThemeProvider } from 'styled-components';
import theme, { COLORS } from './theme';
import useScreenType from '../util/hooks/useScreenType';
import Menu from './menu';
import OutsideClick from './outsideClick';
import Helmet from 'react-helmet';

export default function Template(props) {
  const { children, location } = props;
  const [showMenu, setShowMenu] = useState(false);
  const [inTransition, setInTranstiion] = useState(false);
  const { gte768 } = useScreenType();
  const siteTitle = get(data, 'site.siteMetadata.title');
  const siteDescription = get(data, 'site.siteMetadata.description');
  return (
    <ThemeProvider theme={theme}>
      <Helmet
        htmlAttributes={{ lang: 'ko' }}
        title={siteTitle}
        meta={[
          { name: 'description', content: siteDescription },
          {
            name: 'google-site-verification',
            content: 'R3ZeY1PmaJUY9j_cgNABjesJFgHWVCJpb4TsdfXntMA',
          },
        ]}
      >
        <meta
          name="naver-site-verification"
          content="23eddf7267bb527337927baff11fc26157637f30"
        />
      </Helmet>
      <Box>
        <OutsideClick onClick={() => setShowMenu(false)}>
          <Header
            {...props}
            showMenu={showMenu}
            onClickMenu={() => {
              setShowMenu(!showMenu);
              setInTranstiion(true);
            }}
          />
        </OutsideClick>
        <Box mt="50px">
          {!gte768 && (
            <Box
              width="100%"
              bg="white"
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
              <Box m="10px">
                {MENU_DATA.map(item => (
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
        </Box>
        <Box
          className="contents"
          mx="auto"
          p="45px 20px"
          css={{
            maxWidth: '800px',
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export const MENU_DATA = [
  { pathname: '/programming', title: '개발' },
  { pathname: '/essay', title: '일기' },
  { pathname: '/review', title: '책리뷰' },
  { pathname: '/tags', title: '태그' },
];
