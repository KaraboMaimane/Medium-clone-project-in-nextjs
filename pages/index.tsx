import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Banner from '../components/Banner'
import Header from '../components/Header'
import Posts from '../components/Posts'
import { getPosts } from '../queries/getPosts'
import {sanityClient} from '../sanity'
import { Post } from '../typings'

interface Props{
  posts: [Post]
}

export const getServerSideProps = async() => {
  const posts = await sanityClient.fetch(getPosts);

  return {
    props: {
      posts
    }
  }
}

const Home: NextPage<Props> = ({ posts }: Props) => {
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Banner />

      {/* Posts section */}
      <Posts posts={posts}/>
    </div>
  )
}

export default Home
