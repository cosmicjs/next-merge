import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
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
import { getMergeId, combineMergeContent } from '@/lib/merge'
import RemoveMergeContentBanner from '@/components/remove-merge-content-banner'
import { Post } from 'interfaces'
import { ParsedUrlQueryInput } from 'querystring'
import dynamic from 'next/dynamic'

const fetcher = url => fetch(url).then(r => r.json())

const DynamicContainer = dynamic(() => import('@/components/container'), {
  ssr: false,
})

type PostProps = {
  post: Post;
  morePosts: Post[];
  preview: boolean;
};

const Post = (props: PostProps) => {
  let {
    post,
    morePosts,
    preview
  } = props;

  const router = useRouter()
  const { slug } = router.query
  const merge_id = getMergeId()

    // Check for has merge post
    const { data: mergePost } = useSWR(
      merge_id ? `/api/get-merge-request-posts/${merge_id}/${slug}` : null,
      fetcher
    );

    if (mergePost && mergePost.status !== 404) {
      post = mergePost
      // @ts-ignore
      delete router.isFallback
    }
  
    // Check for has merge posts
    const { data: mergePosts } = useSWR(
      merge_id ? `/api/get-merge-request-posts/${merge_id}/` : null,
      fetcher
    );

    if (mergePosts) {
      morePosts = combineMergeContent(morePosts, mergePosts, true)
    }
  
  if (merge_id && !post?.slug) {
    // @ts-ignore
    router.isFallback = true;
  }
  if (!router.isFallback && !post?.slug)
    return <ErrorPage statusCode={404} />

  return (
    <div>
      <Layout preview={preview}>
        <DynamicContainer>
          {
            merge_id &&
            <RemoveMergeContentBanner />
          }
          <Header />
          {router.isFallback ? (
            <PostTitle>Loading…</PostTitle>
          ) : (
            <div>
              <article>
                <Head>
                  <title>
                    {Post['title']} | Next.js Blog Example with {CMS_NAME}
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
                <PostBody content={post['content']} />
              </article>
              <SectionSeparator />
              {morePosts.length > 0 && <MoreStories posts={morePosts} />}
            </div>
          )}
        </DynamicContainer>
      </Layout>
    </div>
  )
}

type staticProps = {
  params: ParsedUrlQueryInput;
  preview: boolean;
}

export const getStaticProps = async (props: staticProps) => {
  let {
    params,
    preview = null
  } = props;
  const data = await getPostAndMorePosts(params.slug as string, preview)
  const content = await markdownToHtml(data['post']?.metadata?.content || '')
  return {
    props: {
      preview,
      post: {
        ...data['post'],
        content,
      },
      morePosts: data['morePosts'] || [],
    },
  }
}

export const getStaticPaths = async () => {
  const allPosts = (await getAllPostsWithSlug()) || []
  return {
    paths: allPosts.map((post) => `/posts/${post.slug}`),
    fallback: true,
  }
}

export default Post;