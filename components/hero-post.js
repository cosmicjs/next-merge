import Avatar from './avatar'
import Date from './date'
import CoverImage from './cover-image'
import Link from 'next/link'

export default function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
  merge_id
}) {
  return (
    <section>
      <div className="mb-8 md:mb-16">
        {
          !merge_id &&
          <CoverImage title={title} url={coverImage.imgix_url} slug={slug} />
        }
        {
          // Because Imgix component weirdness
          merge_id &&
          <Link as={`/posts/${slug}`} href="/posts/[slug]">
            <a><img className="w-full" title={title} src={`${coverImage.imgix_url}?w=1000`} slug={slug} /></a>
          </Link>
        }
      </div>
      <div className="md:grid md:grid-cols-2 md:col-gap-16 lg:col-gap-8 mb-20 md:mb-28">
        <div>
          <h3 className="mb-4 text-4xl lg:text-6xl leading-tight">
            <Link as={`/posts/${slug}`} href="/posts/[slug]">
              <a className="hover:underline">{title}</a>
            </Link>
          </h3>
          <div className="mb-4 md:mb-0 text-lg">
            <Date dateString={date} />
          </div>
        </div>
        <div>
          <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
          <Avatar
            name={author.title}
            picture={author.metadata.picture.imgix_url}
          />
        </div>
      </div>
    </section>
  )
}
