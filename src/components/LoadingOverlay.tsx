import { Spinner } from './Spinner'

export function LoadingOverlay() {
  return (
    <div className="pointer-events-none absolute z-10 flex h-full w-full flex-col items-center justify-center bg-white/75">
      <Spinner />
      <p className="bg-white pt-6">We are submitting your answers...</p>
    </div>
  )
}
