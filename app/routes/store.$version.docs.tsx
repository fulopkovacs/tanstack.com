import { type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { Docs } from '~/components/Docs'
import {
  createLogo,
  getBranch,
  repo,
  useReactStoreDocsConfig,
} from '~/routes/store'
import { configSchema } from '~/utils/config'
import { fetchRepoFile } from '~/utils/documents.server'

export const loader = async (context: LoaderFunctionArgs) => {
  const branch = getBranch(context.params.version)
  const config = await fetchRepoFile(
    repo,
    branch,
    `docs/tanstack-docs-config.json`
  )
  const { version } = context.params

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

export default function Component() {
  const { tanstackDocsConfig, version } = useLoaderData<typeof loader>()
  let config = useReactStoreDocsConfig(tanstackDocsConfig)
  return (
    <Docs
      {...{
        v2: true,
        logo: createLogo(version),
        colorFrom: 'from-gray-700',
        colorTo: 'to-gray-900',
        textColor: 'text-gray-700',
        config,
        framework: config.frameworkConfig,
        version: config.versionConfig,
      }}
    >
      <Outlet />
    </Docs>
  )
}
