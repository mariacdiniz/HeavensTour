import { lazy, Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const AircraftSceneLazy = lazy(() =>
  import('@/three/AircraftScene').then((m) => ({ default: m.AircraftScene })),
)

export function LazyAircraftScene(
  props: React.ComponentProps<typeof AircraftSceneLazy>,
) {
  return (
    <Suspense
      fallback={
        <div
          className="w-full overflow-hidden rounded-2xl"
          style={{ height: typeof props.height === 'number' ? props.height : 400 }}
        >
          <Skeleton className="size-full" />
        </div>
      }
    >
      <AircraftSceneLazy {...props} />
    </Suspense>
  )
}
