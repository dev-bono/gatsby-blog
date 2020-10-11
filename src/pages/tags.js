import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import TagList from '../components/TagList';

export default function TagsPage({ data, location }) {
  const { group } = data.allMarkdownRemark;
  const { title } = data.site.siteMetadata;
  const sortedGroup = group
    .filter((tag) => tag.totalCount >= MIN_TAG_COUNT)
    .sort(compare);
  return (
    <TagList
      location={location}
      data={data}
      title={title}
      sortedGroup={sortedGroup}
    />
  );
}

// TODO: 타입스크립트로 바꾸면 없애자.
TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
};

const compare = (a, b) => (a.totalCount < b.totalCount ? 1 : -1);
const MIN_TAG_COUNT = 2;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(filter: { frontmatter: { draft: { ne: true } } }) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;
