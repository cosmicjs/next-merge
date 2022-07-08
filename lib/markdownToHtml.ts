import remarkHtml from 'remark-html'
import { unified } from 'unified'
import remarkParse from 'remark-parse'

const markdownToHtml = async (markdown: string) => {
  const result = await unified().use(remarkParse).use(remarkHtml).process(markdown)
  return result.toString()
}

export default markdownToHtml;