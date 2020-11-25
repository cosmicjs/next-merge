import Cosmic from 'cosmicjs'
import _ from 'lodash'

const BUCKET_SLUG = process.env.COSMIC_BUCKET_SLUG
const READ_KEY = process.env.COSMIC_READ_KEY
const MERGE_ID = process.env.MERGE_ID

const bucket = Cosmic().bucket({
  slug: BUCKET_SLUG,
  read_key: READ_KEY,
})

const is404 = (error) => /not found/i.test(error.message)

export async function getPreviewPostBySlug(slug) {
  const params = {
    slug,
    props: 'slug',
    status: 'all',
  }

  try {
    const data = await bucket.getObject(params)
    return data.object
  } catch (error) {
    // Don't throw if an slug doesn't exist
    if (is404(error)) return
    throw error
  }
}

export async function getAllPostsWithSlug() {
  const params = {
    type: 'posts',
    props: 'slug',
  }
  const data = await bucket.getObjects(params)
  return data.objects
}

export async function getMergeRequestPosts() {
  if (!MERGE_ID)
    return;
  const merge_api_url = `http://localhost:3000/v1/${BUCKET_SLUG}/merge-requests/${MERGE_ID}/objects?read_key=${READ_KEY}&pretty=true&props=slug,title,content,metadata,created_at,type_slug`;
  const data = await fetch(merge_api_url)
  .then(response => response.json());
  return data.objects
}

export async function getAllPostsForHome(preview) {
  const params = {
    type: 'posts',
    props: 'title,slug,metadata,created_at',
    sort: '-created_at',
    ...(preview && { status: 'all' }),
  }
  const data = await bucket.getObjects(params)
  let allPosts = data.objects;
  // Update posts with merge data
  const mergePosts = (await getMergeRequestPosts()) || []
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
  // Reorder
  allPosts = _.orderBy(allPosts, ['created_at'],['desc'])
  return allPosts;
}

export async function getPostAndMorePosts(slug, preview) {
  const singleObjectParams = {
    slug,
    props: 'slug,title,metadata,created_at',
    ...(preview && { status: 'all' }),
  }
  const moreObjectParams = {
    type: 'posts',
    limit: 3,
    props: 'title,slug,metadata,created_at',
    ...(preview && { status: 'all' }),
  }
  const mergePosts = (await getMergeRequestPosts()) || []
  let object = _.find(mergePosts, { slug: slug });
  if (!object) {
    object = await bucket.getObject(singleObjectParams).catch((error) => {
      // Don't throw if an slug doesn't exist
      if (is404(error)) return
      throw error
    })
  } else {
    object = { object }
  }
  const moreObjects = await bucket.getObjects(moreObjectParams)
  const morePosts = moreObjects.objects
    ?.filter(({ slug: object_slug }) => object_slug !== slug)
    .slice(0, 2)

  return {
    post: object?.object,
    morePosts,
  }
}
