import cn from 'classnames'
import Link from 'next/link'
import Imgix from 'react-imgix'
import { getMergeId } from '@/lib/merge'

export default function CoverImage({ title, url, slug }) {
  let image = (
    <Imgix
      src={url}
      alt={`Cover Image for ${title}`}
      className={cn('lazyload shadow-small w-full', {
        'hover:shadow-medium transition-shadow duration-200': slug,
      })}
      sizes="100vw"
      attributeConfig={{
        src: 'data-src',
        srcSet: 'data-srcset',
        sizes: 'data-sizes',
      }}
      htmlAttributes={{
        src: `${url}?auto=format,compress&q=1&blur=500&w=auto`,
      }}
    />
  )
  // Because Imgix component weirdness
  const merge_id = getMergeId()
  if (merge_id)
    image = (
      <Link as={`/posts/${slug}`} href="/posts/[slug]">
        <a><img className="w-full" title={title} src={`${url}?w=1000`} slug={slug} /></a>
      </Link>
    )
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <a aria-label={title}>{image}</a>
        </Link>
      ) : (
        image
      )}
    </div>
  )
}
