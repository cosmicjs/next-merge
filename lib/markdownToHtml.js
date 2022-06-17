import remarkHtml from 'remark-html'
import {unified} from 'unified'
import remarkParse from 'remark-parse'

export default async function markdownToHtml(markdown) {
  const result = await unified().use(remarkParse).use(remarkHtml).process('markdown')
  console.log(result)
  return result.toString()
}
