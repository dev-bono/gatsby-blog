import React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Layout from '../components/layout'
import { rhythm, scale } from '../utils/typography'
import Disqus from 'disqus-react'

class BlogPostTemplate extends React.Component {
  render() {
    const { data, pageContext, location } = this.props
    const { previous, next } = pageContext
    const { href } = location
    const post = data.markdownRemark
    const { title, date } = post.frontmatter
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const siteDescription = post.excerpt

    if (!href) {
      return null
    }
    const disqusShortname = 'bonogithub'
    const disqusConfig = {
      url: href,
      identifier: post.id,
      title,
    }
    return (
      <Layout location={location}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={`${title} | ${siteTitle}`}
          script={[ADSENSE_SCRIPT_1, ADSENSE_SCRIPT_2]}
        />
        <h3 style={{ lineHeight: rhythm(1.1) }}>{title}</h3>
        <p
          style={{
            ...scale(-1 / 5),
            display: 'block',
            marginBottom: rhythm(3),
            marginTop: rhythm(-1),
            color: '#bbb',
          }}
        >
          {date}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
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
            marginBottom: 30,
            fontSize: rhythm(0.5),
          }}
        >
          <li style={{ maxWidth: 280 }}>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li style={{ maxWidth: 280 }}>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
        <Disqus.DiscussionEmbed
          shortname={disqusShortname}
          config={disqusConfig}
        />
      </Layout>
    )
  }
}

const ADSENSE_SCRIPT_1 = {
  async: true,
  src: '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
}
const ADSENSE_SCRIPT_2 = {
  innerHTML: `(adsbygoogle = window.adsbygoogle || []).push({
    google_ad_client: "ca-pub-4588610260101909",
    enable_page_level_ads: true
  });`,
}

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

export default BlogPostTemplate
