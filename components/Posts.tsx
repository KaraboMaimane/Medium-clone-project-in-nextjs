import Link from 'next/link'
import React, { Props } from 'react'
import { urlFor } from '../sanity'
import { Post } from '../typings'

function Posts(props: { posts: Post[] }) {
  return (
    <div>
      {props.posts.map((post) => {
        return (
          <>
            <Link key={post.id} href={`/post/${post.slug.current}`}>
              <div>
                  <img src={urlFor(post.mainImage).url()!} alt="" />
              </div>
            </Link>
          </>
        )
      })}
    </div>
  )
}

export default Posts
