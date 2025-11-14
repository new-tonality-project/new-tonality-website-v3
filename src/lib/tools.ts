import dissonanceSurveyImage from '@/images/tools/dissonance-survey.png'
import legacyV1Image from '@/images/tools/legacy-v1.png'
import legacyV2Image from '@/images/tools/legacy-v2.png'
import { type Tool } from './types'

export const tools: Tool[] = [
  // {
  //   name: 'Dissonance perception survey',
  //   description:
  //     'Take part in an interactive psychoacoustic experiment to measure your personal perception of dissonance and compare your results with others.',
  //   logo: dissonanceSurveyImage,
  //   link: { href: '/tools/dissonance-survey', label: 'Explore' },
  // },
  {
    name: 'Legacy Additive Synth V1',
    description:
      'Generate inharmonic samples and see its dissonance curve that marks related tuning. Geberate sounds that are compatible with arbitrary EDO tuning systems.',
    logo: legacyV1Image,
    link: { href: 'https://v1.newtonality.net', label: 'Explore' },
  },
  {
    name: 'Legacy Additive Synth V2',
    description:
      'A different version of additive synth with ability to stack multiple inharmonic layers. Instead of dissonance curve is has aplayable board tuned to the related tuning system.',
    logo: legacyV2Image,
    link: { href: 'https://v2.newtonality.net', label: 'Explore' },
  },
]
