import Link from 'next/link'
import React, { Props } from 'react'
import { urlFor } from '../sanity'
import { Post } from '../typings'

function Posts(props: { posts: Post[] }) {
  return (
    <div className='grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6'>
      {props.posts.map((post) => {
        return (
          <>
            <Link key={post.id} href={`/post/${post.slug.current}`}>
              <div className='overflow-hidden border rounded-lg cursor-pointer group'>
                <img className='object-cover w-full transition-transform duration-200 ease-in-out h-60 group-hover:scale:105' src={urlFor(post.mainImage).url()!} alt="" />
                <div className='flex justify-between p-5 bg-white'>
                  <div>
                    <p className='text-lg font-bold'>{post.title}</p>
                    <p className='text-xs'>{post.description} by {post.author.name}</p>
                  </div>

                  <img className='w-12 h-12 rounded-full' src={urlFor(post.author.image).url()!} alt="" />
                </div>
              </div>
            </Link>
          </>
        )
      })}
    </div>
  )
}

export default Posts
