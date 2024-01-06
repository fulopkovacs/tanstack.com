import {
  Link,
  Outlet,
  useLocation,
  useRouteLoaderData,
  useSearchParams,
} from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import { DefaultErrorBoundary } from '~/components/DefaultErrorBoundary'
import { fetchRepoFile } from '~/utils/documents.server'
import { configSchema } from '~/utils/config'

export const v1branch = 'main'

export const loader: LoaderFunction = async () => {
  const repo = 'tanstack/router'

  const config = await fetchRepoFile(
    repo,
    v1branch,
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
    }
  } catch (e) {
    // TODO: handle the error
    // Redirect to the error page?
    throw new Error('Invalid docs/tanstack-docs-config.json file')
  }
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
