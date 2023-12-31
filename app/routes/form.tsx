import * as React from 'react'
import {
  Link,
  Outlet,
  useMatches,
  useNavigate,
  useParams,
} from '@remix-run/react'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { seo } from '~/utils/seo'
import { generatePath, useMatchesData } from '~/utils/utils'
import reactLogo from '~/images/react-logo.svg'
import solidLogo from '~/images/solid-logo.svg'
import vueLogo from '~/images/vue-logo.svg'
import svelteLogo from '~/images/svelte-logo.svg'
import angularLogo from '~/images/angular-logo.svg'
import { FaDiscord, FaGithub } from 'react-icons/fa'
import type { AvailableOptions } from '~/components/Select'
import { Scarf } from '~/components/Scarf'

export const loader = async (context: LoaderFunctionArgs) => {
  if (
    !context.request.url.includes('/form/v') &&
    !context.request.url.includes('/form/latest')
  ) {
    return redirect(`${new URL(context.request.url).origin}/form/latest`)
  }

  return new Response('OK')
}

export default function RouteForm() {
  return (
    <>
      <Outlet />
      <Scarf id="72ec4452-5d77-427c-b44a-57515d2d83aa" />
    </>
  )
}
