import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, graphql } from 'gatsby';
import get from 'lodash/get';
import Layout from '../components/layout';
import Adsense from '../components/adsense';
import { Box, Flex, Text } from 'rebass';

export default function BlogPostTemplate({ data, pageContext, location }) {
  const { previous, next } = pageContext;
  const post = data.markdownRemark;
  const { title, date } = post.frontmatter;
  const siteTitle = get(data, 'site.siteMetadata.title');
  const siteUrl = get(data, 'site.siteMetadata.siteUrl');
  const twitterUsername = get(data, 'site.siteMetadata.twitterUsername');
  const { excerpt: postDescription } = post;
  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'Article',
    name: title,
    datePublished: date,
  };

  useEffect(() => {
    const body = document.body;
    appendScript(body, ADSENSE_SCRIPT_1);
    appendScript(body, CODEPEN_SCRIPT);
  }, []);

  return (
    <Layout location={location} data={data}>
      <Helmet
        htmlAttributes={{ lang: 'ko' }}
        meta={[
          { name: 'description', content: postDescription },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: siteUrl },
          { property: 'og:title', content: title },
          { property: 'og:description', content: postDescription },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:creater', content: twitterUsername },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: postDescription },
        ]}
        title={`${title} | ${siteTitle}`}
      >
        {/* <link rel="canonical" href={fields?.slug} /> */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <Box as="header">
        <Text fontSize="24px" lineHeight="1.1">
          {title}
        </Text>
        <Text mb="70px" mt="7px" color="#bbb">
          {date}
        </Text>
        {/* 상단 광고 */}
        <Box mb="40px">
          <Adsense slot="1331884154" />
        </Box>
      </Box>
      <Box
        color="text"
        dangerouslySetInnerHTML={{ __html: post.html }}
        css={{ lineHeight: '30px' }}
      />
      <Box as="footer" mt="30px">
        <Flex
          justifyContent="space-between"
          mb="30px"
          pt="30px"
          fontSize="15px"
          css={{
            borderTop: '1px solid #eee',
          }}
        >
          {previous && (
            <Text lineHeight="1.8" mr="5px" css={{ maxWidth: 280 }}>
              <Link to={previous.fields.slug} rel="prev">
                {previous.frontmatter.title}
              </Link>
            </Text>
          )}
          {next && (
            <Text
              lineHeight="1.8"
              ml="5px"
              textAlign="right"
              css={{ maxWidth: 280 }}
            >
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title}
              </Link>
            </Text>
          )}
        </Flex>
        {/* 하단 광고 */}
        <Box mb="40px">
          <Adsense slot="5306007932" />
        </Box>
        <Box>
          <script
            src="https://utteranc.es/client.js"
            repo="blueshw/gatsby-blog"
            issue-term="pathname"
            theme="github-light"
            // eslint-disable-next-line react/no-unknown-property
            crossorigin="anonymous"
            async
          />
        </Box>
      </Box>
    </Layout>
  );
}

const ADSENSE_SCRIPT_1 = {
  defer: true,
  src: '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
};
const CODEPEN_SCRIPT = {
  defer: true,
  src: 'https://static.codepen.io/assets/embed/ei.js',
};

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        twitterUsername
      }
    }
    markdownRemark(
      frontmatter: { draft: { ne: true } }
      fields: { slug: { eq: $slug } }
    ) {
      id
      excerpt(truncate: true)
      html
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
      }
      # fields {
      #   slug
      # }
    }
  }
`;

function appendScript(elem, scriptObj) {
  const { defer, src } = scriptObj;
  const script = document.createElement('script');
  script.defer = defer;
  script.src = src;
  elem.appendChild(script);
}
