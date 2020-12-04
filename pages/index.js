import Container from '@/components/container'
import MoreStories from '@/components/more-stories'
import HeroPost from '@/components/hero-post'
import Intro from '@/components/intro'
import Layout from '@/components/layout'
import { getAllPostsForHome } from '@/lib/api'
import Head from 'next/head'
import { CMS_NAME } from '@/lib/constants'
import useSWR from 'swr'
import _ from 'lodash'

const removeMergeContent = () => {
  localStorage.removeItem('merge_id')
  window.location.href = '/';
}

export default function Index({ allPosts }) {
  let has_merge_content;
  // Check for merge_id in URL or localStorage
  if (process.browser) {
    const urlParams = new URLSearchParams(window.location.search);
    let merge_id = urlParams.get('merge_id');
    if (window.localStorage.getItem('merge_id'))
      merge_id = window.localStorage.getItem('merge_id');
    if (merge_id) {
      const { data: mergePosts } = useSWR(`/api/get-merge-request-posts/${merge_id}`)
      if (mergePosts) {
        allPosts.forEach((post, i) => {
          const mergePostFound = _.find(mergePosts, { slug: post.slug });
          if (mergePostFound) {
            allPosts[i] = mergePostFound;
          }
        })
        // Add new post
        mergePosts.forEach((post, i) => {
          const allPostFound = _.find(allPosts, { slug: post.slug });
          if (!allPostFound && post.type_slug === 'posts') {
            allPosts.push(post);
          }
        })
      }
      allPosts = _.orderBy(allPosts, ['created_at'],['desc'])
      localStorage.setItem('merge_id',merge_id)
      has_merge_content = true;
    }
  }
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  return (
    <>
      <Layout>
        <Head>
          <title>Next.js Blog Example with {CMS_NAME}</title>
        </Head>
        <Container>
          {
            has_merge_content &&
            <div className="text-center pt-5 pb-5 bg-black text-white">You are previewing merge content. <span className="cursor-pointer" onClick={() => removeMergeContent() }>Click here to remove</span>.</div>
          }
          <Intro />
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.metadata.cover_image}
              date={heroPost.created_at}
              author={heroPost.metadata.author}
              slug={heroPost.slug}
              excerpt={heroPost.metadata.excerpt}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview }) {
  const allPosts = (await getAllPostsForHome(preview)) || []
  return {
    props: { allPosts },
  }
}
