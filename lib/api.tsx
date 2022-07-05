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

type getPreviewPostBySlugProps = {
  slug: string,
};

export const getPreviewPostBySlug = async (props: getPreviewPostBySlugProps) => {
  const { slug } = props;
  const params = {
    query: {
      slug,
      type: 'posts'
    },
    props: 'slug',
    status: 'any',
  }

  try {
    const data = await bucket.getObjects(params)
    return data.objects[0]
  } catch (err) {
    // Don't throw if an slug doesn't exist
    return <ErrorPage statusCode={err.status} />
  }
}

export const getAllPostsWithSlug = async () => {
  const params = {
    query: {
      type: 'posts'
    },
    props: 'slug',
  }
  const data = await bucket.getObjects(params)
  return data.objects
}

type getMergeRequestPostsProps = {
  merge_id,
};

export const getMergeRequestPosts = async (props: getMergeRequestPostsProps) => {
  const { merge_id } = props;
  const merge_api_url = `${COSMIC_API_URL}/v2/buckets/${BUCKET_SLUG}/merge-requests/${merge_id}/objects?read_key=${READ_KEY}&pretty=true&props=slug,title,content,metadata,created_at,type_slug`;
  const data = await fetch(merge_api_url)
    .then(response => response.json());
  return data.objects
}

export const getAllPostsForHome = async (preview: boolean) => {
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
  allPosts = _.orderBy(allPosts, ['created_at'], ['desc'])
  return allPosts;
}

export const getPostAndMorePosts = async (slug: string, preview: boolean,) => {

  const singleObjectParams = {
    query: {
      slug,
      type: 'posts'
    },
    props: 'slug,title,metadata,created_at',
    ...(preview && { status: 'any' }),
  }
  const moreObjectParams = {
    query: {
      type: 'posts'
    },
    limit: 3,
    props: 'title,slug,metadata,created_at',
    ...(preview && { status: 'any' }),
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