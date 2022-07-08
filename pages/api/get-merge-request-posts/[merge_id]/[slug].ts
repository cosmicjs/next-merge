import { getMergeRequestPosts } from "../../../../lib/api";
import _ from "lodash";
import markdownToHtml from "@/lib/markdownToHtml";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let { merge_id, slug } = req.query;

  merge_id = Array.isArray(merge_id) ? merge_id[0] : merge_id;
  slug = Array.isArray(slug) ? slug[0] : slug;

  if (!merge_id) {
    return res.status(400).json({ status: 400, message: "Bad request" });
  }

  const posts = await getMergeRequestPosts(merge_id);

  const mergePost = _.find(posts, { slug: slug });

  if (!mergePost) {
    return res.status(404).json({ status: 404, message: "Not found" });
  }
  
  const html = await markdownToHtml(mergePost?.metadata?.content || "");
  mergePost.content = html;
  res.json(mergePost);
};

export default handler;