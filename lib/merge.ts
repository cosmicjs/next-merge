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

export const combineMergeContent = (content: Post[], mergeContent: Post[], addNewContent: boolean) => {
  // Edit existing content
  content.forEach((post: any, i) => {
    const mergePostFound = post.find(mergeContent, { slug: post.slug });
    if (mergePostFound) {
      content[i] = mergePostFound;
    }
  })
  // Add new content
  if (addNewContent) {
    mergeContent.forEach((post: any, i) => {
      const allPostFound = post.find(content, { slug: post.slug });
      if (!allPostFound && post.type_slug === 'posts') {
        content.push(post);
      }
    })
  }
  return content;
}
