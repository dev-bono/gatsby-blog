import React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Layout from '../components/layout'
import { rhythm, scale } from '../utils/typography'

class BlogPostTemplate extends React.Component {
  componentDidMount() {
    initUtterances()
  }
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const siteDescription = post.excerpt
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={`${post.frontmatter.title} | ${siteTitle}`}
          script={[
            {
              async: true,
              src: '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
            },
            {
              innerHTML: `(adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: "ca-pub-4588610260101909",
                enable_page_level_ads: true
              });`,
            },
          ]}
        />
        <h3 style={{ lineHeight: rhythm(1.1) }}>{post.frontmatter.title}</h3>
        <p
          style={{
            ...scale(-1 / 5),
            display: 'block',
            marginBottom: rhythm(3),
            marginTop: rhythm(-1),
            color: '#bbb',
          }}
        >
          {post.frontmatter.date}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <div className="commentsWrap" />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            fontSize: rhythm(0.5),
          }}
        >
          <li style={{ width: 280 }}>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li style={{ width: 280 }}>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Layout>
    )
  }
}

function initUtterances() {
  const utterancesConfig = {
    src: 'https://utteranc.es/client.js',
    repo: 'blueshw/gatsby-blog',
    branch: 'master',
    async: true,
    'issue-term': 'pathname',
    theme: 'github-light',
  }
  const utterances = document.createElement('script')
  const commentsWrap = document.querySelector('.commentsWrap')

  Object.keys(utterancesConfig).forEach(configKey => {
    utterances.setAttribute(configKey, utterancesConfig[configKey])
  })

  commentsWrap.insertAdjacentElement('afterend', utterances)
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
