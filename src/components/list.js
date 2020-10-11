import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'gatsby';
import Layout from './Layout';
import get from 'lodash/get';
import { Helmet } from 'react-helmet';
import s from './css/List.module.scss';

export default function Posts({ data, location, isTagPage, pageContext }) {
  const [showCount, setShowCount] = useState(DEFAULT_SHOW_COUNT);
  const posts = get(data, 'allMarkdownRemark.edges');
  const totalCount = get(data, 'allMarkdownRemark.totalCount');
  const siteDescription = get(data, 'site.siteMetadata.description');

  useEffect(() => {
    setShowCount(DEFAULT_SHOW_COUNT);
  }, [posts]);

  useEffect(() => {
    function isElementUnderBottom(elem, triggerDiff) {
      const { top } = elem.getBoundingClientRect();
      const { innerHeight } = window;
      return top > innerHeight + (triggerDiff || 0);
    }
    function handleScroll() {
      const elems = document.querySelectorAll('.up-on-scroll');
      elems.forEach((elem) => {
        if (isElementUnderBottom(elem, 20)) {
          elem.style.opacity = '0';
          elem.style.transform = 'translateY(70px)';
        } else {
          elem.style.opacity = '1';
          elem.style.transform = 'translateY(0px)';
        }
      });
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showPosts = useMemo(
    () => posts.filter((_, index) => index < showCount),
    [showCount, posts]
  );

  const meta = [{ name: 'description', content: siteDescription }];
  isTagPage && meta.push({ name: 'robots', content: 'noindex' });

  return (
    <Layout location={location} data={data}>
      <Helmet meta={meta} />
      {isTagPage && (
        <div className={s.tagPageTitleWrapper}>
          <div className={s.tagName}>{pageContext.tag}</div>
          <div className={s.tagName}>({totalCount})</div>
        </div>
      )}
      <ul className={s.list}>
        {showPosts.map(({ node }) => {
          const title = get(node, 'frontmatter.title') || node.fields.slug;
          return (
            <li className="up-on-scroll" key={node.fields.slug}>
              <Link style={{ boxShadow: 'none' }} to={node.fields.slug}>
                <span className={s.title}>{title}</span>
              </Link>
              <div
                className={s.desc}
                dangerouslySetInnerHTML={{ __html: node.excerpt }}
              />
              <div className={s.date}>{node.frontmatter.date}</div>
            </li>
          );
        })}
      </ul>
      {showCount <= posts.length && (
        <div className={s.moreWrapper}>
          <button
            className={s.moreButton}
            onClick={() => setShowCount(showCount + 25)}
          >
            show more
          </button>
        </div>
      )}
    </Layout>
  );
}
const DEFAULT_SHOW_COUNT = 25;
