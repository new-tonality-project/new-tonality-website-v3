import setharesDissonanceImage from '@/images/tools/sethares-dissonance.png'
import { type Tool } from './types'

export const tools: Tool[] = [
  {
    name: 'Dissonance perception survey',
    description:
      'Go thorugh the actual psychoacoustic experiment that was first outlined in 1960s paper by Plomp and Levelt and that is the basis behind modern empirical understanding of dissoannce.',
    logo: setharesDissonanceImage,
    link: { href: '/tools/dissonance-survey', label: 'Explore' },
  },
  {
    name: 'Legacy Synth V1',
    description:
      'Generate and download your own microtonal and inharmonic samples compatible with arbitrary EDO tuning systems.',
    logo: setharesDissonanceImage,
    link: { href: 'https://v1.newtonality.net', label: 'Explore' },
  },
  {
    name: 'Legacy Synth V2',
    description:
      'Version 2 microtonal synth with ability to add multiple spectral layers and a playable board that is tuned to the related tuning system.',
    logo: setharesDissonanceImage,
    link: { href: 'https://v2.newtonality.net', label: 'Explore' },
  },
]

