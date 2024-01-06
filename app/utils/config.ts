import { z } from 'zod'

export type FrameworkMenu = {
  framework: string
  menuItems: MenuItem[]
}

export type MenuItem = {
  label: string | React.ReactNode
  children: {
    label: string | React.ReactNode
    to: string
  }[]
}

const menuItemSchema = z.object({
  label: z.string(),
  children: z.array(
    z.object({
      label: z.string(),
      to: z.string(),

      badge: z.string().optional(),
    })
  ),
})

const frameworkMenuSchema = z.object({
  framework: z.string(),
  menuItems: z.array(menuItemSchema),
})

export const configSchema = z.object({
  latestVersion: z.string(),
  availableVersions: z
    .array(
      z.object({
        name: z.string(),
        branch: z.string(),
      })
    )
    .min(1),
  docSearch: z
    .object({
      appId: z.string(),
      apiKey: z.string(),
      indexName: z.string(),
    })
    .optional(),
  menu: z.array(menuItemSchema),
  frameworkMenus: z.array(frameworkMenuSchema).optional(),
  users: z.array(z.string()).optional(),
})

export type ConfigSchema = z.infer<typeof configSchema>

export function getCurrentlySelectedFrameworkFromLocalStorage(
  selectedFramework?: string
) {
  const framework =
    selectedFramework || localStorage.getItem('framework') || 'react'

  return framework
}
