import React from 'react';
import Helmet from 'react-helmet';
import { Link, graphql } from 'gatsby';
import get from 'lodash/get';
import Layout from '../components/layout';
import Adsense from '../components/adsense';
import Disqus from 'disqus-react';
import { Box, Flex, Text } from 'rebass';

export default function BlogPostTemplate({ data, pageContext, location }) {
  const { previous, next } = pageContext;
  const { href } = location;
  const post = data.markdownRemark;
  const { title, date } = post.frontmatter;
  const siteTitle = get(data, 'site.siteMetadata.title');
  const postDescription = post.excerpt;

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
    <Layout location={location} data={data}>
      <Helmet
        title={title}
        htmlAttributes={{ lang: 'ko' }}
        meta={[
          { name: 'description', content: postDescription },
          { property: 'og:type', content: 'article' },
          { property: 'og:url', content: href },
          { property: 'og:title', content: title },
          { property: 'og:description', content: postDescription },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: postDescription },
        ]}
        title={`${title} | ${siteTitle}`}
        script={[ADSENSE_SCRIPT_1, CODEPEN_SCRIPT]}
      />
      <Text fontSize="24px" lineHeight="1.1">
        {title}
      </Text>
      <Text mb="90px" mt="7px" color="#bbb">
        {date}
      </Text>
      <Box mb="40px">
        <Adsense slot="1331884154" />
      </Box>
      <Box
        color="text"
        dangerouslySetInnerHTML={{ __html: post.html }}
        css={{ lineHeight: '30px' }}
      />
      <Box mb="30px" />
      <Flex
        flexWrap="wrap"
        justifyContent="space-between"
        mb="30px"
        pt="30px"
        fontSize="15px"
        css={{
          borderTop: '1px solid #eee',
        }}
      >
        {previous && (
          <Text lineHeight="1.8" css={{ maxWidth: 280 }}>
            <Link to={previous.fields.slug} rel="prev">
              {previous.frontmatter.title}
            </Link>
          </Text>
        )}
        {next && (
          <Text lineHeight="1.8" css={{ maxWidth: 280 }}>
            <Link to={next.fields.slug} rel="next">
              {next.frontmatter.title}
            </Link>
          </Text>
        )}
      </Flex>
      <Box mb="40px">
        <Adsense slot="5306007932" />
      </Box>
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
const CODEPEN_SCRIPT = {
  async: true,
  src: 'https://static.codepen.io/assets/embed/ei.js',
};

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
