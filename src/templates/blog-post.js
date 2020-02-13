import React from "react";
import PropTypes from "prop-types";
import { kebabCase } from "lodash";
import Helmet from "react-helmet";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import Img from "gatsby-image";
import containerStyles from "./blog-post.module.css";

export const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  photos,
  tags,
  title,
  helmet
}) => {
  const PostContent = contentComponent || Content;
  console.log(photos);
  return (
    <section className="section">
      {helmet || ""}
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              {title}
            </h1>
            <p>{description}</p>
            <div className={containerStyles.gridRow}>
              <div className={containerStyles.gridColumn}>
                {photos.blurbs.map((photo, index) => {
                  if (index % 2 === 0) {
                    return (
                      <Img
                        key={photo.image.id}
                        style={{ width: `100%` }}
                        fluid={photo.image.childImageSharp.fluid}
                      />
                    );
                  }
                  return null
                })}
              </div>
              <div className={containerStyles.gridColumn}>
                {photos.blurbs.map((photo, index) => {
                  if (index % 2 === 1) {
                    return (
                      <Img
                        key={photo.image.id}
                        style={{ width: `100%` }}
                        fluid={photo.image.childImageSharp.fluid}
                      />
                    );
                  }
                  return null
                })}
              </div>
            </div>
            <PostContent content={content} />
            {tags && tags.length ? (
              <div style={{ marginTop: `4rem` }}>
                <h4>Tags</h4>
                <ul className="taglist">
                  {tags.map(tag => (
                    <li key={tag + `tag`}>
                      <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

BlogPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  photos: PropTypes.object,
  title: PropTypes.string,
  helmet: PropTypes.object
};

const BlogPost = ({ data }) => {
  const { markdownRemark: post } = data;

  return (
    <Layout>
      <BlogPostTemplate
        content={post.html}
        contentComponent={HTMLContent}
        description={post.frontmatter.description}
        photos={post.frontmatter.photos}
        helmet={
          <Helmet titleTemplate="%s | Blog">
            <title>{`${post.frontmatter.title}`}</title>
            <meta
              name="description"
              content={`${post.frontmatter.description}`}
            />
          </Helmet>
        }
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
      />
    </Layout>
  );
};

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object
  })
};

export default BlogPost;

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
        photos {
          blurbs {
            text
            image {
              id
              relativePath
              childImageSharp {
                fluid(maxWidth: 480, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`;
