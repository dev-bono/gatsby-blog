import React from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import { rhythm, scale } from '../utils/typography'

class Posts extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const siteDescription = get(
      this,
      'props.data.site.siteMetadata.description'
    )
    const posts = get(this, 'props.data.allMarkdownRemark.edges')

    return (
      <Layout location={this.props.location}>
        <Helmet
          htmlAttributes={{ lang: 'ko' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={siteTitle}
        />
        {posts.map(({ node }) => {
          const title = get(node, 'frontmatter.title') || node.fields.slug
          return (
            <div style={{ marginBottom: rhythm(1.8) }} key={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                  fontWeight: 300,
                  ...scale(0.3),
                }}
              >
                <Link style={{ boxShadow: 'none' }} to={node.fields.slug}>
                  <span style={{ color: '#444' }}>{title}</span>
                </Link>
              </h3>
              <small>{node.frontmatter.date}</small>
              <p
                style={{ fontSize: 14, color: '#999' }}
                dangerouslySetInnerHTML={{ __html: node.excerpt }}
              />
            </div>
          )
        })}
      </Layout>
    )
  }
}

export default Posts
