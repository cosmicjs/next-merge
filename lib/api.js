import Cosmic from 'cosmicjs'
import _ from 'lodash'
import ErrorPage from 'next/error'

const BUCKET_SLUG = process.env.COSMIC_BUCKET_SLUG
const READ_KEY = process.env.COSMIC_READ_KEY
const COSMIC_API_URL = `https://api.cosmicjs.com`

const bucket = Cosmic().bucket({
  slug: BUCKET_SLUG,
  read_key: READ_KEY,
})

export async function getPreviewPostBySlug(slug) {
  const params = {
    query: {
      slug,
      type: 'posts'
    },
    props: 'slug',
    status: 'all',
  }

  try {
    const data = await bucket.getObjects(params)
    return data.objects[0]
  } catch (err) {
    // Don't throw if an slug doesn't exist
    return <ErrorPage statusCode={err.status} />
  }
}

export async function getAllPostsWithSlug() {
  const params = {
    query: {
      type: 'posts'
    },
    props: 'slug',
  }
  const data = await bucket.getObjects(params)
  return data.objects
}

export async function getMergeRequestPosts(merge_id) {
  const merge_api_url = `${COSMIC_API_URL}/v2/buckets/${BUCKET_SLUG}/merge-requests/${merge_id}/objects?read_key=${READ_KEY}&pretty=true&props=slug,title,content,metadata,created_at,type_slug`;
  const data = await fetch(merge_api_url)
  .then(response => response.json());
  return data.objects
}

export async function getAllPostsForHome(preview) {
  const params = {
    query: {
      type: 'posts'
    },
    props: 'title,slug,metadata,created_at',
    sort: '-created_at',
    ...(preview && { status: 'all' }),
  }
  const data = await bucket.getObjects(params)
  let allPosts = data.objects;
  // Reorder
  allPosts = _.orderBy(allPosts, ['created_at'],['desc'])
  return allPosts;
}

export async function getPostAndMorePosts(slug, preview) {
  const singleObjectParams = {
    query: { 
      slug,
      type: 'posts'
    },
    props: 'slug,title,metadata,created_at',
    ...(preview && { status: 'all' }),
  }
  const moreObjectParams = {
    query: {
      type: 'posts'
    },
    limit: 3,
    props: 'title,slug,metadata,created_at',
    ...(preview && { status: 'all' }),
  }
  let object
  try {
    const data = await bucket.getObjects(singleObjectParams)
    object = data.objects[0]
  } catch (err) {
    return <ErrorPage statusCode={err.status} />
  }
  const moreObjects = await bucket.getObjects(moreObjectParams)
  const morePosts = moreObjects.objects
    ?.filter(({ slug: object_slug }) => object_slug !== slug)
    .slice(0, 2)

  return {
    post: object,
    morePosts,
  }
}
