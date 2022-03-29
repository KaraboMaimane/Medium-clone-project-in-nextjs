import { GetStaticProps } from 'next'
import React from 'react'
import PortableText from 'react-portable-text'
import Header from '../../components/Header'
import { getPostSlugs } from '../../queries/getPostSlugs'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'

//define prop type
interface Props {
  post: Post
}

// getting our post data and setting the interface type
function Post({ post }: Props) {
  return (
    <main>
      <Header />

      <img
        className="object-cover w-full h-40"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />

      <article className="max-w-3xl p-5 mx-auto">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>

        <div className="flex items-center space-x-2">
          <img
            className="w-10 h-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div className="">
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: ({children}:any) => (
                <>
                  <h1 className="my-5 text-2xl font-bold">{children}</h1>
                </>
              ),

              h2: ({children}:any) => (
                <>
                  <h1 className="my-5 text-xl font-bold">{children}</h1>
                </>
              ),

              li: ({children}:any) => (
                <>
                  <h1 className="ml-4 list-disc">{children}</h1>
                </>
              ),

              link: ({ href, children }: any) => (
                <>
                  <a className="ml-4 list-disc">{children}</a>
                </>
              ),
            }}
          />
        </div>
      </article>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug {
        current
      }
      }`

  // we collect our slugs here using get static paths
  const posts = await sanityClient.fetch(query)

  // we turn those slugs into params so we can use them for pre-fetching
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  //if we dont get anything we go to a 404 error or we get our paths back
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
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
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 30,
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
