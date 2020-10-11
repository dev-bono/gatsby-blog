import React, { useMemo } from 'react';
import s from './css/TableOfContents.module.scss';
import cn from 'classnames';

export default function TableOfContents({ items, currentHeaderUrl }) {
  const replaceItems = useMemo(() => {
    if (currentHeaderUrl) {
      return items.replace(
        `"${currentHeaderUrl}"`,
        `"${currentHeaderUrl}" class="${s.isCurrent}"`
      );
    } else {
      return items;
    }
  }, [currentHeaderUrl]);
  return items ? (
    <nav className={cn('table-of-contents', s.container)}>
      <h3 className={s.title}>TABLE OF CONTENTS</h3>
      <div
        className={s.contents}
        dangerouslySetInnerHTML={{ __html: replaceItems }}
      />
    </nav>
  ) : null;
}
