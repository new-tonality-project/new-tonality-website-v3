import dissonanceSurveyImage from '@/images/tools/dissonance-survey.png'
import legacyV1Image from '@/images/tools/legacy-v1.png'
import legacyV2Image from '@/images/tools/legacy-v2.png'
import { type Tool } from './types'

export const tools: Tool[] = [
  {
    name: 'Dissonance perception survey',
    description:
      'Go thorugh the actual psychoacoustic experiment that was first outlined in 1960s paper by Plomp and Levelt and that is the basis behind modern empirical understanding of dissoannce.',
    logo: dissonanceSurveyImage,
    link: { href: '/tools/dissonance-survey', label: 'Explore' },
  },
  {
    name: 'Legacy Synth V1',
    description:
      'Generate and download your own microtonal and inharmonic samples compatible with arbitrary EDO tuning systems.',
    logo: legacyV1Image,
    link: { href: 'https://v1.newtonality.net', label: 'Explore' },
  },
  {
    name: 'Legacy Synth V2',
    description:
      'Version 2 microtonal synth with ability to add multiple spectral layers and a playable board that is tuned to the related tuning system.',
    logo: legacyV2Image,
    link: { href: 'https://v2.newtonality.net', label: 'Explore' },
  },
]

