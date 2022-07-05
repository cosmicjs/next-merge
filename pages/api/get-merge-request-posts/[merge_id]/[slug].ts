import { getMergeRequestPosts } from '../../../../lib/api'
import _ from 'lodash'
import markdownToHtml from '@/lib/markdownToHtml'

type handlerProps = {
  req: any,
  res: any,
};

const handler = async (props: handlerProps) => {
  const {
    req,
    res,
  } = props;
  const {
    query: { merge_id, slug },
  } = req
  if (!merge_id)
    return res.status(400).json({ status: 400, message: 'Bad request' })
  const posts = await getMergeRequestPosts(merge_id)
  const mergePost = _.find(posts, { slug: slug })
  if (!mergePost)
    return res.status(404).json({ status: 404, message: 'Not found' })
  const html = await markdownToHtml(mergePost?.metadata?.content || '')
  mergePost.content = html
  res.json(mergePost)
}

export default handler;