import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_tool/booklet-imposition')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_tool/booklet-imposition"!</div>
}
