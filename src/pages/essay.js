import React from 'react';
import { graphql } from 'gatsby';
import Posts from '../components/list';
import { Flex, Text } from 'rebass';

export default function Essay(props) {
  return (
    <>
      <Flex
        flexDirection="column"
        m="100px 20px 0px"
        justifyContent="center"
        alignItems="center"
        color="#aaa"
        fontSize="13px"
      >
        <Text mb="5px">더이상 이 블로그에서 에세이를 쓰지 않습니다.</Text>
        <Text>
          에세이는{' '}
          <a
            href="https://brunch.co.kr/@blueshw83"
            style={{
              borderBottom: '3px solid #d7c3ee',
              color: '#aaa',
              textDecoration: 'none',
            }}
          >
            브런치
          </a>
          에서 읽어주세요.
        </Text>
      </Flex>
      <Posts {...props} />
    </>
  );
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      filter: {
        frontmatter: {
          category: { in: ["essay", "review"] }
          draft: { ne: true }
        }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
      edges {
        node {
          excerpt(truncate: true)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
            category
          }
        }
      }
    }
  }
`;
