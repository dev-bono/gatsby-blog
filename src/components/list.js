import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'gatsby';
import Layout from '../components/layout';
import { Box, Text, Flex } from 'rebass';
import get from 'lodash/get';
import Helmet from 'react-helmet';

export default function Posts({ data, location, isTagPage, pageContext }) {
  const [showCount, setShowCount] = useState(DEFAULT_SHOW_COUNT);
  const posts = get(data, 'allMarkdownRemark.edges');
  const totalCount = get(data, 'allMarkdownRemark.totalCount');
  const siteDescription = get(data, 'site.siteMetadata.description');

  useEffect(() => {
    setShowCount(DEFAULT_SHOW_COUNT);
  }, [posts]);

  const showPosts = useMemo(
    () => posts.filter((_, index) => index < showCount),
    [showCount, posts]
  );

  return (
    <Layout location={location} data={data}>
      <Helmet meta={[{ name: 'description', content: siteDescription }]} />
      {isTagPage && (
        <Flex
          m="20px auto 60px"
          flexDirection="column"
          justify-content="center"
          align-items="center"
        >
          <Text fontSize="25px" lineHeight="1.6" textAlign="center">
            {pageContext.tag}
          </Text>
          <Text fontSize="15px" color="#888" textAlign="center">
            ({totalCount})
          </Text>
        </Flex>
      )}
      {showPosts.map(({ node }) => {
        const title = get(node, 'frontmatter.title') || node.fields.slug;
        return (
          <Box mb="50px" key={node.fields.slug}>
            <Text mb="15px" fontSize="22px" lineHeight="1.7">
              <Link css={{ boxShadow: 'none' }} to={node.fields.slug}>
                {title}
              </Link>
            </Text>
            <Text
              fontSize="15px"
              lineHeight="1.8"
              color="#999"
              mb="6px"
              dangerouslySetInnerHTML={{ __html: node.excerpt }}
            />
            <Text
              fontSize="14px"
              mb="5px"
              color="#888"
              width="100%"
              textAlign="right"
              css={{ opacity: 0.8 }}
            >
              {node.frontmatter.date}
            </Text>
          </Box>
        );
      })}
      {showCount <= posts.length && (
        <Flex mt="70px" width="100%" justifyContent="center">
          <Text
            fontSize="20px"
            color="#888"
            onClick={() => setShowCount(showCount + 25)}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            show more
          </Text>
        </Flex>
      )}
    </Layout>
  );
}
const DEFAULT_SHOW_COUNT = 25;
