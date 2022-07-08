import { Post } from "interfaces";

export const removeMergeContent = () => {
  localStorage.removeItem('merge_id')
  window.location.href = '/';
}

export const getMergeId = () => {
  if (!process.browser)
    return;
  const urlParams = new URLSearchParams(window.location.search);
  let merge_id = urlParams.get('merge_id');
  if (merge_id) {
    localStorage.setItem('merge_id', merge_id)
  } else if (window.localStorage.getItem('merge_id')) {
    merge_id = window.localStorage.getItem('merge_id');
  }
  return merge_id;
}

export const combineMergeContent = (posts: Post[], mergePosts: Post[], addNewContent: boolean) => {
  // Edit existing content
  posts.forEach((post: Post, i) => {
    const mergePostFound = mergePosts.find((mergePost) => mergePost.slug === post.slug);
    if (mergePostFound) {
      posts[i] = mergePostFound;
    }
  })
  // Add new content
  if (addNewContent) {
    mergePosts.forEach((mergePost: Post) => {
      const allPostFound = posts.find((post) => post.slug === mergePost.slug);
      if (!allPostFound && mergePost.type === 'posts') {
        posts.push(mergePost);
      }
    })
  }
  return posts;
}