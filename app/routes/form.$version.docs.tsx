import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { Docs } from '~/components/Docs'
import {
  createLogo,
  getBranch,
  repo,
  useReactFormDocsConfig,
} from '~/routes/form'
import { getTanstackDocsConfig } from '~/utils/config'

export const loader = async (context: LoaderFunctionArgs) => {
  const branch = getBranch(context.params.version)
  const tanstackDocsConfig = await getTanstackDocsConfig(repo, branch)
  const { version } = context.params

  return json({
    tanstackDocsConfig,
    version,
  })
}

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
