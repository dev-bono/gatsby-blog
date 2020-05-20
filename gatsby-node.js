const _ = require('lodash');
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const blogPost = path.resolve('./src/templates/blog-post.js');
  const tagTemplate = path.resolve('src/templates/tag.js');

  const result = await graphql(
    `
      {
        allMarkdownRemark(
          filter: { frontmatter: { draft: { ne: true } } }
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                tags
              }
            }
          }
        }
      }
    `
  );
  if (result.errors) {
    throw result.errors;
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges;
  let tags = [];

  _.each(posts, (post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;
    createPage({
      path: post.node.fields.slug,
      tags: post.node.frontmatter.tags,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    });

    if (_.get(post, 'node.frontmatter.tags')) {
      tags = tags.concat(post.node.frontmatter.tags);
    }
  });
  tags = _.uniq(tags);
  _.each(tags, (tag) => {
    createPage({
      path: `/tag/${_.kebabCase(tag)}`,
      component: tagTemplate,
      context: {
        tag,
      },
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
