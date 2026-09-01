import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_fgAuthenticated/fg/archiveBoss/places')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/_fgAuthenticated/fg/archiveBoss/places"!</div>
}
