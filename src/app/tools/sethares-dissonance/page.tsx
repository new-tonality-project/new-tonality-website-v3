import { SimpleLayout } from '@/components'
import { SetharesDissonance } from './SetharesDissonance'
import { auth } from '@clerk/nextjs/server'
import { getInitialPreset } from './utils'

export default async function SetharesDissoanancePage() {
  const { userId } = await auth()
  const initialPreset = await getInitialPreset(userId)

  return (
    <SimpleLayout
      title="Sethares dissonance"
      intro="Discover the world of dissonance curves"
    >
      <SetharesDissonance initialPreset={initialPreset} />
    </SimpleLayout>
  )
}
