import React, { useState, useEffect } from 'react';
import Header from './Header';
import '../common/css/reset.scss';
import 'prismjs/themes/prism-tomorrow.css';
import '../common/css/common.scss';
import { ThemeProvider } from 'styled-components';
import theme from '../common/theme';
import OutsideClick from './OutsideClick';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';
import s from './css/Layout.module.scss';
import cn from 'classnames';

export default function Template(props) {
  const { children, data } = props;
  const [showMenu, setShowMenu] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const siteTitle = get(data, 'site.siteMetadata.title');
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const curScrollY = window.pageYOffset;
      if (curScrollY > 80 && prevScrollY < curScrollY && showHeader) {
        setShowHeader(false);
      } else if (
        (curScrollY <= 80 || prevScrollY > curScrollY) &&
        !showHeader
      ) {
        setShowHeader(true);
      }
      showMenu && setShowMenu(false);
      setPrevScrollY(window.pageYOffset);
    };
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollY]);
  return (
    <ThemeProvider theme={theme}>
      <div clsaaName={s.container}>
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
            showHeader={showHeader}
            onClickMenu={() => setShowMenu(!showMenu)}
          />
        </OutsideClick>
        <main className={cn(s.contentWrapper, 'contents')}>{children}</main>
      </div>
    </ThemeProvider>
  );
}
