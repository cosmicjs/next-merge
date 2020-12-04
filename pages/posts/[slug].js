import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '@/components/container'
import PostBody from '@/components/post-body'
import MoreStories from '@/components/more-stories'
import Header from '@/components/header'
import PostHeader from '@/components/post-header'
import SectionSeparator from '@/components/section-separator'
import Layout from '@/components/layout'
import { getAllPostsWithSlug, getPostAndMorePosts } from '@/lib/api'
import PostTitle from '@/components/post-title'
import Head from 'next/head'
import { CMS_NAME } from '@/lib/constants'
import markdownToHtml from '@/lib/markdownToHtml'
import useSWR from 'swr'
import _ from 'lodash'

export default function Post({ post, morePosts, preview }) {
  const router = useRouter()
  if (process.browser) {
    const { slug } = router.query
    const urlParams = new URLSearchParams(window.location.search);
    let merge_id = urlParams.get('merge_id');
    if (window.localStorage.getItem('merge_id'))
      merge_id = window.localStorage.getItem('merge_id');
    if (merge_id) {
      const { data: mergePosts } = useSWR(`/api/get-merge-request-posts/${merge_id}`)
      const mergePost = _.find(mergePosts, { slug: slug });
      if (mergePost)
        post = mergePost;
      localStorage.setItem('merge_id',merge_id)
    }
  }
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {post.title} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta
                  property="og:image"
                  content={post.metadata.cover_image.imgix_url}
                />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.metadata.cover_image}
                date={post.created_at}
                author={post.metadata.author}
              />
              <PostBody content={post.content} />
            </article>
            <SectionSeparator />
            {morePosts.length > 0 && <MoreStories posts={morePosts} />}
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params, preview = null }) {
  const data = await getPostAndMorePosts(params.slug, preview)
  const content = await markdownToHtml(data.post?.metadata?.content || '')
  return {
    props: {
      preview,
      post: {
        ...data.post,
        content,
      },
      morePosts: data.morePosts || [],
    },
  }
}

export async function getStaticPaths() {
  const allPosts = (await getAllPostsWithSlug()) || []
  return {
    paths: allPosts.map((post) => `/posts/${post.slug}`),
    fallback: true,
  }
}
