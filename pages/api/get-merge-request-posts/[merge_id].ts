import { NextApiRequest, NextApiResponse } from "next";
import { getMergeRequestPosts } from "../../../lib/api";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  let { merge_id } = request.query;

  merge_id = Array.isArray(merge_id) ? merge_id[0] : merge_id;

  if (!merge_id) {
    return response.status(400).json({ status: 400, message: "Bad request" });
  }

  const posts = await getMergeRequestPosts(merge_id);

  response.json(posts);
};

export default handler;