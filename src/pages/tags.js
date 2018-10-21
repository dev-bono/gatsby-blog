import React from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash/kebabCase';
import Helmet from 'react-helmet';
import { navigate, graphql } from 'gatsby';
import Layout from '../components/layout';
import { rhythm } from '../utils/typography';

class TagsPage extends React.Component {
  onClickTag = e => {
    navigate(e.target.dataset.url);
  };

  render() {
    const { data, location } = this.props;
    const { group } = data.allMarkdownRemark;
    const { title } = data.site.siteMetadata;
    const sortedGroup = group
      .filter(tag => tag.totalCount >= MIN_TAG_COUNT)
      .sort(compare);
    return (
      <Layout location={location}>
        <Helmet htmlAttributes={{ lang: 'ko' }} title={title} />
        <div css={{ marginTop: rhythm(1.3) }}>
          <ul
            css={{
              listStyle: 'none',
              margin: 0,
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {sortedGroup.map(tag => (
              <li
                key={tag.fieldValue}
                css={{ marginRight: 13, height: rhythm(1.4) }}
              >
                <div
                  css={{
                    ...getTagCountStyle(tag.totalCount),
                    padding: '3px 13px',
                    borderRadius: 18,
                    cursor: 'pointer',
                    transition: '0.5s',
                    ':hover': {
                      backgroundColor: '#aaa',
                      color: '#eee',
                      fontWeight: 600,
                    },
                  }}
                  onClick={this.onClickTag}
                  data-url={`/tag/${kebabCase(tag.fieldValue)}/`}
                >
                  {tag.fieldValue}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Layout>
    );
  }
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

function getTagCountStyle(totalCount) {
  const hoverStyle = {};
  if (totalCount > 15) {
    return { backgroundColor: '#d1d1d1', color: '#333', fontWeight: 300 };
  } else if (totalCount > 10) {
    return { backgroundColor: '#dfdfdf', color: '#555', fontWeight: 300 };
  } else if (totalCount > 5) {
    return { backgroundColor: '#eaeaea', color: '#777', fontWeight: 300 };
  } else {
    return { backgroundColor: '#f3f3f3', color: '#999' };
  }
}

export default TagsPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;
