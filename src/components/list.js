import React from 'react';
import { Link } from 'gatsby';
import get from 'lodash/get';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import { rhythm, scale } from '../utils/typography';

class Posts extends React.Component {
  render() {
    const { location, isTagPage, pageContext } = this.props;
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    const siteDescription = get(
      this,
      'props.data.site.siteMetadata.description'
    );
    const posts = get(this, 'props.data.allMarkdownRemark.edges');
    const totalCount = get(this, 'props.data.allMarkdownRemark.totalCount');

    return (
      <Layout location={location}>
        <Helmet
          htmlAttributes={{ lang: 'ko' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={siteTitle}
        />
        {isTagPage && (
          <div css={{ margin: '20px auto 60px', textAlign: 'center' }}>
            <h2 css={{ marginBottom: 0 }}>{pageContext.tag}</h2>
            <span css={{ fontSize: 15, color: '#888' }}>({totalCount})</span>
          </div>
        )}
        {posts.map(({ node }) => {
          const title = get(node, 'frontmatter.title') || node.fields.slug;
          return (
            <div css={{ marginBottom: rhythm(1.8) }} key={node.fields.slug}>
              <h3
                css={{
                  marginBottom: rhythm(1 / 4),
                  fontWeight: 300,
                  ...scale(0.3),
                }}
              >
                <Link css={{ boxShadow: 'none' }} to={node.fields.slug}>
                  <span css={{ color: '#444' }}>{title}</span>
                </Link>
              </h3>
              <small>{node.frontmatter.date}</small>
              <p
                css={{ fontSize: 14, color: '#999' }}
                dangerouslySetInnerHTML={{ __html: node.excerpt }}
              />
            </div>
          );
        })}
      </Layout>
    );
  }
}

export default Posts;
