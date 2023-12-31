import pkg from '@docsearch/react'
import type { DocSearchProps } from '@docsearch/react'
const { DocSearch } = pkg

export function Search(props: DocSearchProps) {
  return <DocSearch {...props} />
}
