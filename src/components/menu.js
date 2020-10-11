import React from 'react';
import { Link } from 'gatsby';
import { DEFAULT_STYLE_LINK } from '../common/constants';
import s from './css/Menu.module.scss';
import cn from 'classnames';

export default function Menu({
  pathname,
  menuPathname,
  menuName,
  isVertical = false,
}) {
  const selected = pathname.indexOf(menuPathname) >= 0;
  return (
    <li
      className={cn(
        isVertical ? s.verticalContainer : s.container,
        isVertical && selected ? s.selected : ''
      )}
    >
      <Link style={DEFAULT_STYLE_LINK} to={menuPathname}>
        <span className={cn(s.menuName, selected ? s.selectedMenu : '')}>
          {menuName}
        </span>
      </Link>
    </li>
  );
}
