import React from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash/kebabCase';
import { Helmet } from 'react-helmet';
import { navigate, graphql } from 'gatsby';
import Layout from '../components/layout';
import { Box, Flex } from 'rebass/styled-components';

export default function TagsPage({ data, location }) {
  const { group } = data.allMarkdownRemark;
  const { title } = data.site.siteMetadata;
  const sortedGroup = group
    .filter((tag) => tag.totalCount >= MIN_TAG_COUNT)
    .sort(compare);
  return (
    <Layout location={location} data={data}>
      <Helmet htmlAttributes={{ lang: 'ko' }} title={title} />
      <Box mt="25px">
        <Flex flexWrap="wrap">
          {sortedGroup.map((tag) => (
            <Box
              mr="13px"
              mb="25px"
              fontSize="18px"
              key={tag.fieldValue}
              css={{ height: '30px' }}
            >
              <Box
                {...getTagCountStyle(tag.totalCount)}
                p="10px 20px"
                css={{
                  borderRadius: 18,
                  cursor: 'pointer',
                  transition: '0.5s',
                  '&:hover': {
                    backgroundColor: '#aaa',
                    color: '#eee',
                    fontWeight: 600,
                  },
                }}
                onClick={(e) => navigate(e.target.dataset.url)}
                data-url={`/tag/${kebabCase(tag.fieldValue)}/`}
              >
                {tag.fieldValue}
              </Box>
            </Box>
          ))}
        </Flex>
      </Box>
    </Layout>
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

function getTagCountStyle(totalCount) {
  if (totalCount > 15) {
    return { bg: '#d1d1d1', color: '#333', fontWeight: 300 };
  } else if (totalCount > 10) {
    return { bg: '#dfdfdf', color: '#555', fontWeight: 300 };
  } else if (totalCount > 5) {
    return { bg: '#eaeaea', color: '#777', fontWeight: 300 };
  } else {
    return { bg: '#f3f3f3', color: '#999' };
  }
}

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
