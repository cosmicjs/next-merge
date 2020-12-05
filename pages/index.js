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
import { getMergeId, combineMergeContent } from '@/lib/merge'
import RemoveMergeContentBanner from '@/components/remove-merge-content-banner'

export default function Index({ allPosts }) {
  let merge_id;
  if (process.browser) {
    merge_id = getMergeId()
    if (merge_id) {
      const { data: mergePosts } = useSWR(`/api/get-merge-request-posts/${merge_id}`)
      if (mergePosts) {
        allPosts = combineMergeContent(allPosts, mergePosts)
      }
    }
  }
  allPosts = _.orderBy(allPosts, ['created_at'],['desc'])
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
            merge_id &&
            <RemoveMergeContentBanner />
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
              merge_id={merge_id}
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
