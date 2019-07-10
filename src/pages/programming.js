import React from 'react';
import { graphql } from 'gatsby';
import Posts from '../components/list';

export default function Programming(props) {
  return <Posts {...props} />;
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
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { category: { regex: "/^(?!review|essay)([a-z0-9]+)$/" } }
      }
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
