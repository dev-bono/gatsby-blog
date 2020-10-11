import React from 'react';
import { graphql } from 'gatsby';
import Posts from '../components/list';

import EssayHeader from '../components/EssayHeader';

export default function Essay(props) {
  return (
    <>
      <EssayHeader />
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
