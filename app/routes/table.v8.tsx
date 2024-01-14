import {
  Link,
  Outlet,
  useLocation,
  useRouteLoaderData,
  useSearchParams,
} from '@remix-run/react'
import { DefaultErrorBoundary } from '~/components/DefaultErrorBoundary'
import { version } from 'react'
import { json } from '@remix-run/node'
import { getTanstackDocsConfig } from '~/utils/config'

export const v8branch = 'main'

export const loader = async () => {
  const repo = 'tanstack/table'
  const tanstackDocsConfig = await getTanstackDocsConfig(repo, v8branch)

  return json({
    tanstackDocsConfig,
    version,
  })
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
