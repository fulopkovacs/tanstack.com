import { type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { Docs } from '~/components/Docs'
import {
  createLogo,
  getBranch,
  repo,
  useReactFormDocsConfig,
} from '~/routes/form'
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

// TODO: client loader

// load the config for this repo
// we know the repo and the version
// why have a loader instead a function?
// maybe for caching?
// get the config on the server side

export default function Component() {
  const { tanstackDocsConfig, version } = useLoaderData<typeof loader>()
  const config = useReactFormDocsConfig(tanstackDocsConfig)

  return (
    <Docs
      {...{
        v2: true,
        logo: createLogo(version),
        colorFrom: 'from-rose-500',
        colorTo: 'to-violet-500',
        textColor: 'text-violet-500',
        config,
        framework: config.frameworkConfig,
        version: config.versionConfig,
      }}
    >
      <Outlet />
    </Docs>
  )
}
