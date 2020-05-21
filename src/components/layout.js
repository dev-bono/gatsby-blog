import React, { useState, useEffect } from 'react';
import Header from './header';
import '../../static/reset.css';
import 'prismjs/themes/prism-tomorrow.css';
import '../../static/common.css';
import { Box } from 'rebass';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import OutsideClick from './outsideClick';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';

export default function Template(props) {
  const { children, data } = props;
  const [showMenu, setShowMenu] = useState(false);
  const siteTitle = get(data, 'site.siteMetadata.title');

  useEffect(() => {
    const handleScroll = () => showMenu && setShowMenu(false);
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  });
  return (
    <ThemeProvider theme={theme}>
      <Box style={{ overflowX: 'hidden' }}>
        <Helmet htmlAttributes={{ lang: 'ko' }} title={siteTitle}>
          <meta
            name="google-site-verification"
            content="R3ZeY1PmaJUY9j_cgNABjesJFgHWVCJpb4TsdfXntMA"
          />
          <meta
            name="naver-site-verification"
            content="23eddf7267bb527337927baff11fc26157637f30"
          />
        </Helmet>
        <OutsideClick onClick={() => setShowMenu(false)}>
          <Header
            {...props}
            showMenu={showMenu}
            onClickMenu={() => setShowMenu(!showMenu)}
          />
        </OutsideClick>

        <Box
          as="main"
          className="contents"
          mx="auto"
          p="45px 15px"
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
  { pathname: '/interactive-web', title: '인터랙티브웹' },
  { pathname: '/essay', title: '에세이' },
  { pathname: '/tags', title: '태그' },
];
