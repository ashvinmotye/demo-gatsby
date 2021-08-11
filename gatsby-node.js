/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require("path")

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const blogPostTemplate = path.resolve("src/templates/markdown-page.js")

  const result = await graphql(`
    {
      postsRemark: allMarkdownRemark(filter: {frontmatter: {title: {ne: "Dummy Markdown Page"}}}) {
        edges {
          node {
            id
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `)

  // handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const posts = result.data.postsRemark.edges

  // Create post detail pages
  posts.forEach(({ node }) => {
    createPage({
      context: {
        id: node.id,
      },
      path: node.frontmatter.slug,
      component: blogPostTemplate,
    })
  })
}