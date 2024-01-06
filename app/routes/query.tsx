import { Outlet, useRouteLoaderData } from '@remix-run/react'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { seo } from '~/utils/seo'
import { Scarf } from '~/components/Scarf'
import type { QueryConfigLoader } from './query.$version'

export const repo = 'tanstack/query'

const latestBranch = 'main'
export const latestVersion = 'v5'
export const availableVersions = [
  {
    name: 'v5',
    branch: latestBranch,
  },
  {
    name: 'v4',
    branch: 'v4',
  },
  {
    name: 'v3',
    branch: 'v3',
  },
] as const

export function getBranch(argVersion?: string) {
  const version = argVersion || latestVersion

  if (version === 'latest') {
    return latestBranch
  }

  return (
    availableVersions.find((v) => v.name === version)?.branch ?? latestBranch
  )
}

export const useQueryDocsConfig = () => {
  const queryConfigLoaderData = useRouteLoaderData<QueryConfigLoader>(
    'routes/query.$version'
  )

  if (!queryConfigLoaderData?.tanstackDocsConfig) {
    throw new Error('Config could not be read for tanstack/query!')
  }

  return queryConfigLoaderData
}

export const meta: MetaFunction = () => {
  return seo({
    title: 'TanStack Query | React Query, Solid Query, Svelte Query, Vue Query',
    description:
      'Powerful asynchronous state management, server-state utilities and  data fetching for TS/JS, React, Solid, Svelte and Vue',
    image: 'https://github.com/tanstack/query/raw/main/media/repo-header.png',
  })
}

export const loader = async (context: LoaderFunctionArgs) => {
  if (
    !context.request.url.includes('/query/v') &&
    !context.request.url.includes('/query/latest')
  ) {
    return redirect(`${new URL(context.request.url).origin}/query/latest`)
  }

  return new Response('OK')
}

export default function RouteQuery() {
  return (
    <>
      <Outlet />
      <Scarf id="53afb586-3934-4624-a37a-e680c1528e17" />
    </>
  )
}
