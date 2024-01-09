import { Link, Outlet, useLocation, useSearchParams } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import { DefaultErrorBoundary } from '~/components/DefaultErrorBoundary'
import type { DocsConfig } from '~/components/Docs'
import { fetchRepoFile } from '~/utils/documents.server'
import { useMatchesData } from '~/utils/utils'
import { configSchema } from '~/utils/config'

export const v1branch = 'main'

export const loader: LoaderFunction = async () => {
  const repo = 'tanstack/ranger'

  const config = await fetchRepoFile(repo, v1branch, `docs/config.json`)

  if (!config) {
    throw new Error('Repo docs/tanstack-docs-config.json not found!')
  }

  try {
    const tanstackDocsConfigFromJson = JSON.parse(config)
    const validationResult = configSchema.safeParse(tanstackDocsConfigFromJson)

    if (!validationResult.success) {
      // Log the issues that came up during validation
      console.error(JSON.stringify(validationResult.error, null, 2))
      throw new Error('zod validation failed')
    }

    return {
      tanstackDocsConfig: validationResult.data,
    }
  } catch (e) {
    throw new Error('Invalid docs/tanstack-docs-config.json file')
  }
}

export const ErrorBoundary = DefaultErrorBoundary

export const useRangerV1Config = () =>
  useMatchesData('/ranger/v1') as DocsConfig

export default function RouteReactRanger() {
  const [params] = useSearchParams()
  const location = useLocation()

  const show = params.get('from') === 'reactLocationV2'
  const original = params.get('original')

  return (
    <>
      {show ? (
        <div className="p-4 bg-blue-500 text-white flex items-center justify-center gap-4">
          <div>
            Looking for the{' '}
            <a
              href={original || 'https://react-ranger-v1.tanstack.com'}
              className="font-bold underline"
            >
              React Location v2 documentation
            </a>
            ?
          </div>
          <Link
            to={location.pathname}
            replace
            className="bg-white text-black py-1 px-2 rounded-md uppercase font-black text-xs"
          >
            Hide
          </Link>
        </div>
      ) : null}
      <Outlet />
    </>
  )
}
