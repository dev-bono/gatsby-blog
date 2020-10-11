import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';
import get from 'lodash/get';
import Layout from '../components/Layout';
import Post from '../components/Post';

export default function BlogPostTemplate({
  data,
  pageContext,
  location,
  post = data.markdownRemark,
  tocItems = data.markdownRemark.tableOfContents,
}) {
  const { previous, next } = pageContext;
  const commentRef = useRef(null);
  const [currentHeaderUrl, setCurrentHeaderUrl] = useState(undefined);
  useEffect(() => {
    const body = document.body;
    appendScript(body, ADSENSE_SCRIPT_1);
    appendScript(body, CODEPEN_SCRIPT);
    const elem = commentRef.current;
    elem && appendScript(elem, UTTERANCES_SCRIPT);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let aboveHeaderUrl;
      const currentOffsetY = window.pageYOffset;
      const headerElements = document.querySelectorAll('.anchor-header');
      for (const elem of headerElements) {
        const { top } = elem.getBoundingClientRect();
        const elemTop = top + currentOffsetY;
        const isLast = elem === headerElements[headerElements.length - 1];
        if (currentOffsetY < elemTop - HEADER_OFFSET_Y) {
          aboveHeaderUrl &&
            setCurrentHeaderUrl(aboveHeaderUrl.split(location.origin)[1]);
          !aboveHeaderUrl && setCurrentHeaderUrl(undefined);
          break;
        } else {
          isLast && setCurrentHeaderUrl(elem.href.split(location.origin)[1]);
          !isLast && (aboveHeaderUrl = elem.href);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
      <Post
        isTOCVisible={isTOCVisible}
        tocItems={tocItems}
        currentHeaderUrl={currentHeaderUrl}
        title={title}
        date={date}
        post={post}
        previous={previous}
        next={next}
        commentRef={commentRef}
      />
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

const HEADER_OFFSET_Y = 100;
