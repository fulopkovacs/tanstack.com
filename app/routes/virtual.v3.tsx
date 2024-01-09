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
import { json } from '@remix-run/node'

export const v3branch = 'main'

export const loader = async () => {
  const repo = 'tanstack/virtual'

  const config = await fetchRepoFile(
    repo,
    v3branch,
    `docs/tanstack-docs-config.json`
  )

  if (!config) {
    throw new Error('Repo docs/tanstack-docs-config.json not found!')
  }

  try {
    const tanstackDocsConfigFromJson = JSON.parse(config)
    const validationResult = configSchema.safeParse(tanstackDocsConfigFromJson)

    if (!validationResult.success) {
      // Log the issues that come up during validation
      console.error(JSON.stringify(validationResult.error, null, 2))
      throw new Error('Zod validation failed')
    }

    return json({
      tanstackDocsConfig: validationResult.data,
    })
  } catch (e) {
    throw new Error('Invalid docs/tanstack-docs-config.json file')
  }
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
