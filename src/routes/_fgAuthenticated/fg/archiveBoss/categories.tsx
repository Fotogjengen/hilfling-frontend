import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_fgAuthenticated/fg/archiveBoss/categories',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_fgAuthenticated/fg/archiveBoss/categories"!</div>
}
