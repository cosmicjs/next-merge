import remarkHtml from 'remark-html'
import {unified} from 'unified'
import remarkParse from 'remark-parse'

export default async function markdownToHtml(markdown) {
  const result = await unified().use(remarkParse).use(remarkHtml).process(markdown)
  return result.toString()
}
