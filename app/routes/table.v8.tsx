import {
  Link,
  Outlet,
  useLocation,
  useRouteLoaderData,
  useSearchParams,
} from '@remix-run/react'
import { DefaultErrorBoundary } from '~/components/DefaultErrorBoundary'
import { fetchRepoFile } from '~/utils/documents.server'
import { configSchema } from '~/utils/config'
import { version } from 'react'

export const v8branch = 'main'

export const loader = async () => {
  const repo = 'tanstack/table'
  const config = await fetchRepoFile(
    repo,
    v8branch,
    `docs/tanstack-docs-config.json`
  )

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

      version,
    }
  } catch (e) {
    // TODO: handle the error
    // Redirect to the error page?
    throw new Error('Invalid docs/tanstack-docs-config.json file')
  }
}

type TableConfigLoaderData = typeof loader

export const useReactTableV8Config = () => {
  const tableConfigLoaderData =
    useRouteLoaderData<TableConfigLoaderData>('routes/table.v8')
  if (!tableConfigLoaderData?.tanstackDocsConfig) {
    throw new Error('Config could not be read for tanstack/table!')
  }

  return tableConfigLoaderData.tanstackDocsConfig
}

export const ErrorBoundary = DefaultErrorBoundary

export default function RouteReactTable() {
  const [params] = useSearchParams()
  const location = useLocation()

  const show = params.get('from') === 'reactTableV7'
  const original = params.get('original')

  return (
    <>
      {show ? (
        <div className="p-4 bg-blue-500 text-white flex items-center justify-center gap-4">
          <div>
            Looking for the{' '}
            <a
              href={
                original ||
                'https://github.com/TanStack/table/tree/v7/docs/src/pages/docs/'
              }
              className="font-bold underline"
            >
              React Table v7 documentation
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
