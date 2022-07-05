import { getMergeRequestPosts } from '../../../lib/api'

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
  res.json(posts)
}

export default handler;