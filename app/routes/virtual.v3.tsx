import {
  Link,
  Outlet,
  useLocation,
  useRouteLoaderData,
  useSearchParams,
} from '@remix-run/react'
import { DefaultErrorBoundary } from '~/components/DefaultErrorBoundary'
import { json } from '@remix-run/node'
import { getTanstackDocsConfig } from '~/utils/config'

export const v3branch = 'main'

export const loader = async () => {
  const repo = 'tanstack/virtual'

  const tanstackDocsConfig = await getTanstackDocsConfig(repo, v3branch)

  return json({
    tanstackDocsConfig,
  })
}

type VirtualConfigLoaderData = typeof loader

export const ErrorBoundary = DefaultErrorBoundary

export const useVirtualV3Config = () => {
  const virtualConfigData =
    useRouteLoaderData<VirtualConfigLoaderData>('routes/virtual.v3')
  if (!virtualConfigData?.tanstackDocsConfig) {
    throw new Error('Config could not be read for tanstack/virtual!')
  }

  return virtualConfigData.tanstackDocsConfig
}

export default function RouteReactVirtual() {
  const [params] = useSearchParams()
  const location = useLocation()

  const show = params.get('from') === 'reactVirtualV2'
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
                'https://github.com/TanStack/virtual/tree/v2/docs/src/pages/docs'
              }
              className="font-bold underline"
            >
              React Virtual v2 documentation
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
