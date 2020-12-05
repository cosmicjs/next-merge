import { getMergeRequestPosts } from '../../../../lib/api'
import _ from 'lodash'
import markdownToHtml from '@/lib/markdownToHtml'
export default async function handler(req, res) {
  const {
    query: { merge_id, slug },
  } = req
  if (!merge_id)
    return res.status(400).json({ error: true })
  const posts = await getMergeRequestPosts(merge_id)
  const mergePost = _.find(posts, { slug: slug })
  const html = await markdownToHtml(mergePost?.metadata?.content || '')
  mergePost.content = html
  res.json(mergePost)
}