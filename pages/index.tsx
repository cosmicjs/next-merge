import MoreStories from "@/components/more-stories";
import HeroPost from "@/components/hero-post";
import Intro from "@/components/intro";
import Layout from "@/components/layout";
import { getAllPostsForHome } from "@/lib/api";
import Head from "next/head";
import { CMS_NAME } from "@/lib/constants";
import useSWR from "swr";
import _ from "lodash";
import { getMergeId, combineMergeContent } from "@/lib/merge";
import RemoveMergeContentBanner from "@/components/remove-merge-content-banner";
import { Post } from "interfaces";
import dynamic from "next/dynamic";

const fetcher = url => fetch(url).then(r => r.json())

const DynamicContainer = dynamic(() => import("@/components/container"), {
  ssr: false,
});

type IndexProps = {
  allPosts: Post[];
  preview: boolean;
};

const Index = (props: IndexProps) => {
  let { allPosts, preview } = props;
  const merge_id = getMergeId();

  const { data: mergePosts } = useSWR(
    merge_id ? `/api/get-merge-request-posts/${merge_id}` : null,
    fetcher
  );

  if (mergePosts) {
    allPosts = combineMergeContent(allPosts, mergePosts, true);
  }

  const loadingMerge = merge_id && !mergePosts;

  allPosts = _.orderBy(allPosts, ["created_at"], ["desc"]);
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  return (
    <div>
      <Layout preview={preview}>
        <Head>
          <title>Next.js Blog Example with {CMS_NAME}</title>
        </Head>
        <DynamicContainer>
          {merge_id && <RemoveMergeContentBanner />}
          {loadingMerge ? (
            <h1 className="mt-12 text-center text-4xl font-bold tracking-tighter leading-tight">
              Loading Merge Preview...
            </h1>
          ) : (
            <div>
              <Intro />
              {heroPost && (
                <HeroPost
                  title={heroPost.title}
                  coverImage={heroPost.metadata.cover_image}
                  date={heroPost.created_at}
                  author={heroPost.metadata.author}
                  slug={heroPost.slug}
                  excerpt={heroPost.metadata.excerpt}
                />
              )}
              {morePosts.length > 0 && <MoreStories posts={morePosts} />}
            </div>
          )}
        </DynamicContainer>
      </Layout>
    </div>
  );
};

export default Index;

type staticProps = {
  preview: boolean;
};

export const getStaticProps = async (props: staticProps) => {
  const { preview = null } = props;
  const allPosts = (await getAllPostsForHome(preview)) || [];
  return {
    props: { allPosts, preview },
  };
};