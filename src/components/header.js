import React, { useState } from 'react';
import { Link } from 'gatsby';
import Menu from './Menu';
import { DEFAULT_STYLE_LINK } from '../common/constants';
import s from './css/Header.module.scss';
import cn from 'classnames';

export default function Header({
  location,
  showMenu,
  showHeader,
  onClickMenu,
}) {
  const [inTransition, setInTranstiion] = useState(false);
  const { pathname } = location;
  return (
    <>
      <header
        className={cn(s.header, showHeader ? s.showHeader : s.hideHeader)}
      >
        <div className={s.headerTitle}>
          <Link css={DEFAULT_STYLE_LINK} to={'/'}>
            {"bono's blog"}
          </Link>
        </div>
        <nav className="showGte768">
          <ul>
            {MENU_DATA.map((item) => (
              <Menu
                key={item.pathname}
                pathname={pathname}
                menuPathname={item.pathname}
                menuName={item.title}
              />
            ))}
          </ul>
        </nav>
        <div
          className={cn(
            'showLt768',
            s.menuIconWrapper,
            showMenu ? s.isInTransition : ''
          )}
          onClick={() => {
            setInTranstiion(true);
            onClickMenu();
          }}
        >
          <div />
          <div />
          <div />
        </div>
      </header>
      <div style={{ marginTop: '50px' }} />
      <nav
        className={cn(
          'showLt768',
          s.mobileMenuWrapper,
          inTransition || showMenu ? s.showBorder : '',
          showMenu ? s.showMenu : ''
        )}
        onTransitionEnd={() => setInTranstiion(false)}
      >
        <ul>
          {MENU_DATA.map((item) => (
            <div key={item.pathname}>
              <Menu
                pathname={location.pathname}
                menuPathname={item.pathname}
                menuName={item.title}
                isVertical={true}
              >
                {item.title}
              </Menu>
            </div>
          ))}
        </ul>
      </nav>
    </>
  );
}

const MENU_DATA = [
  { pathname: '/programming', title: 'programming' },
  { pathname: '/know-frontend', title: 'frontend 바로알기' },
  { pathname: '/interactive-web', title: 'interactive web' },
  { pathname: '/gatsby', title: 'gatsby js' },
  { pathname: '/essay', title: 'essay' },
  { pathname: '/tags', title: 'tag' },
];
