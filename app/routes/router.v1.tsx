import {
  Link,
  Outlet,
  useLocation,
  useRouteLoaderData,
  useSearchParams,
} from '@remix-run/react'
import { json, type LoaderFunction } from '@remix-run/node'
import { DefaultErrorBoundary } from '~/components/DefaultErrorBoundary'
import { getTanstackDocsConfig } from '~/utils/config'

export const v1branch = 'main'

export const loader: LoaderFunction = async () => {
  const repo = 'tanstack/router'

  const tanstackDocsConfig = await getTanstackDocsConfig(repo, v1branch)

  return json({
    tanstackDocsConfig,
  })
}

type RouterConfigLoaderData = typeof loader

export const ErrorBoundary = DefaultErrorBoundary

export const useRouterV1Config = () => {
  const routerConfigLoaderData =
    useRouteLoaderData<RouterConfigLoaderData>('routes/router.v1')
  if (!routerConfigLoaderData?.tanstackDocsConfig) {
    throw new Error('Config could not be read for tanstack/router!')
  }

  return routerConfigLoaderData.tanstackDocsConfig
}

export default function RouteReactRouter() {
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
              href={original || 'https://react-router-v2.tanstack.com'}
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
