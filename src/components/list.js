import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'gatsby';
import Layout from './Layout';
import { Box, Text, Flex, Button } from 'rebass/styled-components';
import get from 'lodash/get';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

export default function Posts({ data, location, isTagPage, pageContext }) {
  const [showCount, setShowCount] = useState(DEFAULT_SHOW_COUNT);
  const posts = get(data, 'allMarkdownRemark.edges');
  const totalCount = get(data, 'allMarkdownRemark.totalCount');
  const siteDescription = get(data, 'site.siteMetadata.description');

  useEffect(() => {
    setShowCount(DEFAULT_SHOW_COUNT);
  }, [posts]);

  useEffect(() => {
    function isElementUnderBottom(elem, triggerDiff) {
      const { top } = elem.getBoundingClientRect();
      const { innerHeight } = window;
      return top > innerHeight + (triggerDiff || 0);
    }
    function handleScroll() {
      const elems = document.querySelectorAll('.up-on-scroll');
      elems.forEach((elem) => {
        if (isElementUnderBottom(elem, 20)) {
          elem.style.opacity = '0';
          elem.style.transform = 'translateY(70px)';
        } else {
          elem.style.opacity = '1';
          elem.style.transform = 'translateY(0px)';
        }
      });
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showPosts = useMemo(
    () => posts.filter((_, index) => index < showCount),
    [showCount, posts]
  );

  const meta = [{ name: 'description', content: siteDescription }];
  isTagPage && meta.push({ name: 'robots', content: 'noindex' });

  return (
    <Layout location={location} data={data}>
      <Helmet meta={meta} />
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
      <Box as="ul" style={{ listStyle: 'none', marginLeft: 0 }}>
        {showPosts.map(({ node }) => {
          const title = get(node, 'frontmatter.title') || node.fields.slug;
          return (
            <StyledPost
              as="li"
              mb="50px"
              key={node.fields.slug}
              className="up-on-scroll"
            >
              <Link css={{ boxShadow: 'none' }} to={node.fields.slug}>
                <Text as="span" mb="15px" fontSize="22px" lineHeight="1.7">
                  {title}
                </Text>
              </Link>
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
            </StyledPost>
          );
        })}
      </Box>
      {showCount <= posts.length && (
        <Flex mt="70px" width="100%" justifyContent="center">
          <StyledShowMoreButton
            fontSize="18px"
            fontWeight="400"
            color="#999"
            p="5px 10px"
            bg="transparent"
            onClick={() => setShowCount(showCount + 25)}
          >
            show more
          </StyledShowMoreButton>
        </Flex>
      )}
    </Layout>
  );
}
const StyledShowMoreButton = styled(Button)`
  border-radius: 4px;
  border: 1px solid #dedede;
  cursor: pointer;
  transition: all 0.7s;
  outline: none;
  &:hover {
    background-color: #bbb;
    color: #fff;
    border: 1px solid transparent;
  }
`;
const StyledPost = styled(Box)`
  transition: transform 0.7s, opacity 0.7s;
`;
const DEFAULT_SHOW_COUNT = 25;
