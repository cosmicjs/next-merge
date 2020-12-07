export function removeMergeContent() {
  localStorage.removeItem('merge_id')
  window.location.href = '/';
}

export function getMergeId() {
  if (!process.browser)
    return;
  const urlParams = new URLSearchParams(window.location.search);
  let merge_id = urlParams.get('merge_id');
  if (merge_id) {
    localStorage.setItem('merge_id',merge_id)
  } else if (window.localStorage.getItem('merge_id')) {
    merge_id = window.localStorage.getItem('merge_id');
  }
  return merge_id;
}

export function combineMergeContent(content, mergeContent, addNewContent) {
  // Edit existing content
  content.forEach((post, i) => {
    const mergePostFound = _.find(mergeContent, { slug: post.slug });
    if (mergePostFound) {
      content[i] = mergePostFound;
    }
  })
  // Add new content
  if (addNewContent) {
    mergeContent.forEach((post, i) => {
      const allPostFound = _.find(content, { slug: post.slug });
      if (!allPostFound && post.type_slug === 'posts') {
        content.push(post);
      }
    })
  }
  return content;
}