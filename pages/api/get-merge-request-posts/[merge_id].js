import { getMergeRequestPosts } from '../../../lib/api'
export default async function handler(req, res) {
  const {
    query: { merge_id },
  } = req
  if (!merge_id)
    return res.status(400).json({ status: 400, message: 'Bad request' })
  const posts = await getMergeRequestPosts(merge_id)
  res.json(posts)
}