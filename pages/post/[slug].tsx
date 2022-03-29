import { GetStaticProps } from 'next'
import React from 'react'
import Header from '../../components/Header'
import { getPostSlugs } from '../../queries/getPostSlugs'
import { sanityClient } from '../../sanity'
import { Post } from '../../typings'


//define prop type
interface Props{
    post: Post
}

// getting our post data and setting the interface type
function Post({ post }: Props) {
    console.log(post);
  return (
    <main>
        <Header />
    </main>
  )
}

export default Post

export const getStaticPaths = async() => {
    const query = `*[_type == "post"]{
        _id,
        slug {
        current
      }
      }`

    // we collect our slugs here using get static paths
    const posts = await sanityClient.fetch(query);

    // we turn those slugs into params so we can use them for pre-fetching
    const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current
        },
    }));


    //if we dont get anything we go to a 404 error or we get our paths back
    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async({params}) => {
    const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author-> {
        name,
        image
      },
      description,
      mainImage,
      slug,
      body
      }`


      // we make a call to pre-render certain page slugs
      const post = await sanityClient.fetch(query, {
          slug: params?.slug
      })

      if(!post) {
          return {
              notFound: true
          }
      }

      return{
          props: {
            post
          }
      }
}


// *[_type == "post" && slug.current == $slug][0]{
//     _id,
//     _createdAt,
//     title,
//     author-> {
//     name,
//     image
//   },
//   'comments': *[
//     _type == "comment" &&
//     post._ref == ⌃._id &&
//     approved == true],
//   description,
//   mainImage,
//   slug,
//   body
//   }