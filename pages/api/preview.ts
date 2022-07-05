import { getPreviewPostBySlug } from '@/lib/api'

type previewProps = {
  req: any,
  res: any,
};

const preview = async (props: previewProps) => {
  const {
    req,
    res,
  } = props;
  if (
    req.query.secret !== process.env.COSMIC_PREVIEW_SECRET ||
    !req.query.slug
  ) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  const post = await getPreviewPostBySlug(req.query.slug)

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!post) {
    return res.status(401).json({ message: 'Invalid slug' })
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({})

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: `/posts/${post.slug}` })
  res.end()
}


export default preview;