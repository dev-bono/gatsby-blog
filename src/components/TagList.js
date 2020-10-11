import React from 'react';
import kebabCase from 'lodash/kebabCase';
import { Helmet } from 'react-helmet';
import { navigate } from 'gatsby';
import Layout from '../components/layout';
import cn from 'classnames';
import s from './css/TagList.module.scss';

export default function TagList({ location, data, title, sortedGroup }) {
  return (
    <Layout location={location} data={data}>
      <Helmet htmlAttributes={{ lang: 'ko' }} title={title} />
      <div className={s.container}>
        <div className={s.wrapper}>
          {sortedGroup.map((tag) => (
            <div key={tag.fieldValue} className={s.group}>
              <div
                className={cn(s.tag, getTagCountClass(tag.totalCount))}
                onClick={(e) => navigate(e.target.dataset.url)}
                data-url={`/tag/${kebabCase(tag.fieldValue)}/`}
              >
                {tag.fieldValue}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

function getTagCountClass(totalCount) {
  if (totalCount > 15) {
    return s.over15;
  } else if (totalCount > 10) {
    return s.over10;
  } else if (totalCount > 5) {
    return s.over5;
  } else {
    return s.under5;
  }
}
