import React from 'react';
import Helmet from 'react-helmet';
import { Link, graphql } from 'gatsby';
import get from 'lodash/get';
import Layout from '../components/layout';
import Adsense from '../components/adsense';
import { rhythm, scale } from '../utils/typography';
import Disqus from 'disqus-react';

export default function BlogPostTemplate({ data, pageContext, location }) {
  const { previous, next } = pageContext;
  const { href } = location;
  const post = data.markdownRemark;
  const { title, date } = post.frontmatter;
  const siteTitle = get(data, 'site.siteMetadata.title');
  const siteDescription = post.excerpt;

  if (!href) {
    return null;
  }
  const disqusShortname = 'bonogithub';
  const disqusConfig = {
    url: href,
    identifier: post.id,
    title,
  };
  return (
    <Layout location={location}>
      <Helmet
        htmlAttributes={{ lang: 'ko' }}
        meta={[{ name: 'description', content: siteDescription }]}
        title={`${title} | ${siteTitle}`}
        script={[ADSENSE_SCRIPT_1]}
      />
      <h3 css={{ lineHeight: rhythm(1.1) }}>{title}</h3>
      <p
        css={{
          ...scale(-1 / 5),
          display: 'block',
          marginBottom: rhythm(3),
          marginTop: rhythm(-1),
          color: '#bbb',
        }}
      >
        {date}
      </p>
      <div css={{ marginBottom: '40px' }}>
        <Adsense slot="1331884154" />
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <hr
        css={{
          marginBottom: rhythm(1),
        }}
      />
      <ul
        css={{
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
        <li css={{ maxWidth: 280 }}>
          {previous && (
            <Link to={previous.fields.slug} rel="prev">
              ← {previous.frontmatter.title}
            </Link>
          )}
        </li>
        <li css={{ maxWidth: 280 }}>
          {next && (
            <Link to={next.fields.slug} rel="next">
              {next.frontmatter.title} →
            </Link>
          )}
        </li>
      </ul>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
        }}
      >
        <Adsense slot="5306007932" />
        <Adsense slot="3063768225" />
      </div>
      <Disqus.DiscussionEmbed
        shortname={disqusShortname}
        config={disqusConfig}
      />
    </Layout>
  );
}

const ADSENSE_SCRIPT_1 = {
  async: true,
  src: '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
};
// const ADSENSE_SCRIPT_2 = {
//   innerHTML: `(adsbygoogle = window.adsbygoogle || []).push({});`,
// };

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
`;
