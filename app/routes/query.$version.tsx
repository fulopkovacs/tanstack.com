import { Link, Outlet, useLocation, useSearchParams } from '@remix-run/react'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { DefaultErrorBoundary } from '~/components/DefaultErrorBoundary'
import { fetchRepoFile } from '~/utils/documents.server'
import { getBranch, latestVersion, repo } from '~/routes/query'
import { RedirectVersionBanner } from '~/components/RedirectVersionBanner'
import { configSchema } from '~/utils/config'

export const loader = async (context: LoaderFunctionArgs) => {
  const branch = getBranch(context.params.version)
  const config = await fetchRepoFile(
    repo,
    branch,
    `docs/tanstack-docs-config.json`
  )
  const { version, framework } = context.params

  if (!config) {
    throw new Error('Repo docs/config.json not found!')
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
      framework,
      version,
    })
  } catch (e) {
    throw new Error('Invalid docs/tanstack-docs-config.json file')
  }
}

export type QueryConfigLoader = typeof loader

export const ErrorBoundary = DefaultErrorBoundary

export default function RouteVersionParam() {
  const location = useLocation()
  const [params] = useSearchParams()

  const showV3Redirect = params.get('from') === 'reactQueryV3'
  const original = params.get('original')

  const version = location.pathname.match(/\/query\/v(\d)/)?.[1] || '999'

  return (
    <>
      {showV3Redirect ? (
        <div className="p-4 bg-blue-500 text-white flex items-center justify-center gap-4">
          <div>
            Looking for the{' '}
            <a
              href={original || '/query/latest'}
              className="font-bold underline"
            >
              React Query v3 documentation
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
      <RedirectVersionBanner
        currentVersion={version}
        latestVersion={latestVersion}
      />
      <Outlet />
    </>
  )
}
