import React from 'react';
import Adsense from '../components/Adsense';
import TableOfContents from '../components/TableOfContents';
import s from './css/Post.module.scss';
import cn from 'classnames';
import { Link } from 'gatsby';

export default function Post({
  isTOCVisible,
  tocItems,
  currentHeaderUrl,
  title,
  date,
  post,
  previous,
  next,
  commentRef,
}) {
  return (
    <div className={s.container}>
      {isTOCVisible && (
        <div className={s.tocWrapper}>
          <TableOfContents
            items={tocItems}
            currentHeaderUrl={currentHeaderUrl}
          />
        </div>
      )}
      <header>
        <div className={s.title}>{title}</div>
        <div className={s.date}>{date}</div>
      </header>
      <div
        className={s.postWrapper}
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      <footer className={s.footer}>
        <div className={s.otherPosts}>
          {previous && (
            <div className={cn(s.other, s.previous)}>
              <Link to={previous.fields.slug} rel="prev">
                {previous.frontmatter.title}
              </Link>
            </div>
          )}
          {next && (
            <div className={cn(s.other, s.next)}>
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title}
              </Link>
            </div>
          )}
        </div>
        {/* 하단 광고 */}
        <div className={s.adsenseWrapper}>
          <Adsense slot="5306007932" />
        </div>
        <div ref={commentRef} />
      </footer>
    </div>
  );
}
