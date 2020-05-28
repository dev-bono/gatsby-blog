import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link, graphql } from 'gatsby';
import get from 'lodash/get';
import Layout from '../components/layout';
import Adsense from '../components/adsense';
import TableOfContents from '../components/tableOfContents';
import { Box, Flex, Text } from 'rebass/styled-components';

export default function BlogPostTemplate({
  data,
  pageContext,
  location,
  post = data.markdownRemark,
  tocItems = data.markdownRemark.tableOfContents,
}) {
  const { previous, next } = pageContext;
  const commentRef = useRef(null);

  useEffect(() => {
    const body = document.body;
    appendScript(body, ADSENSE_SCRIPT_1);
    appendScript(body, CODEPEN_SCRIPT);
    const elem = commentRef.current;
    elem && appendScript(elem, UTTERANCES_SCRIPT);
  }, []);

  if (!post) {
    return null;
  }
  const isTOCVisible = tocItems?.length > 0;
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
      <Box sx={{ position: 'relative' }}>
        {isTOCVisible && (
          <Flex
            alignItems="flex-start"
            sx={{
              position: 'absolute',
              top: 0,
              height: '100%',
              right: 'calc((100vw - 720px) / 2 * (-1))',
            }}
          >
            <Box
              sx={{
                display: 'none',
                '@media screen and (min-width: 1200px)': {
                  order: 2,
                  position: `sticky`,
                  top: '50px',
                  display: 'block',
                  width: 'calc((100vw - 720px) / 2 - 60px)',
                  maxWidth: '360px',
                  marginRight: '20px',
                  overflow: 'auto',
                  wordBreak: 'break-word',
                },
              }}
            >
              <TableOfContents items={tocItems} />
            </Box>
          </Flex>
        )}
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
          css={{ lineHeight: '30px', position: 'static' }}
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
          <Box ref={commentRef} />
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
const UTTERANCES_SCRIPT = {
  async: true,
  src: 'https://utteranc.es/client.js',
  repo: 'blueshw/gatsby-blog',
  'issue-term': 'pathname',
  theme: 'github-light',
  crossorigin: 'anonymous',
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(truncate: true)
      html
      tableOfContents
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

function appendScript(elem, attrs) {
  const script = document.createElement('script');
  Object.keys(attrs).map((key) => {
    script.setAttribute(key, attrs[key]);
  });
  elem.appendChild(script);
}
