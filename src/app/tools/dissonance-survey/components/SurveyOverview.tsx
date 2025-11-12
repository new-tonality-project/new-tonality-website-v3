'use client'

import { Text, TextLink } from '@/components/catalyst/text'

export function SurveyOverview() {
  return (
    <div>
      

      <Text color="black" className="pb-6">
        The main achievement of the work was the discovery that the sensation of
        dissonance is not a function of the difference between the frequencies
        of the two tones, but rather a function of the critical bandwidth of
        inner ear. In other words, Plomp and Levelt concluded that the sensation
        of dissonance is due to the limited resolution of auditory system that
        cannot distinguish between two tones that are close to each other. In
        order to obtain that result, they used a series of experiments where
        they played a series of random intervals and asked participants to rate
        how smooth or how harsh each interval sounded. The results of each
        individual participant were averaged to obtain the distribution of
        dissonance.
      </Text>

      <Text color="black" className="pb-6">
        The results of Plomp and Levelt were not recieved without cotroversy
        because they deviated from the scientific and musical consensus at that
        time. That was not due to the mistake but because Plomp and Levelt
        intentionally modified their experiments in a way that was not done
        before. Firt of all, the participants were not trained musicians but
        rather people from the general public. Second, they used a series of
        intervals that were not based on 12TET nor on simple ratios. This was
        important to exclude previous training or previous cultural experience
        from the results and get the raw sensory data. Another important aspect
        was that they used pure sinewaves to conduct listening experiments, that
        was done to exclude the role that timbre might play in the perception of
        dissonance.
      </Text>

      <Text color="black" className="pb-6">
        In this survey we attempt to replicate the experiments of Plomp and
        Levelt. They results will not bear the same scientific rigor as the
        experiments are not conducted in controlled laboratory environment, but
        it is still interesting to see how it will compare to the original work.
        Also in the end you will be able to see your own results that you could
        use to build your own dissonance curvesand share them with others. To
        make the most out of it please use headphones or decent speakers. Make
        sure you have a quiet non-distracting environment. And finally, answer
        the questions as truthfully as possible. Thank you for your time!
      </Text>
    </div>
  )
}
