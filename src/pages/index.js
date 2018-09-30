import React from 'react'
import { graphql } from 'gatsby'
import Posts from '../components/list'
import 'prismjs/themes/prism-tomorrow.css'

export default class BlogIndex extends React.Component {
  render() {
    return <Posts {...this.props} />
  }
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
          }
        }
      }
    }
  }
`
