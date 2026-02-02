'use client'

import {
  Container,
  Prose,
  CollapsibleDescription,
  SocialLink,
  YouTubeIcon,
  MailIcon,
} from '@/components'
import { SurveyChart, SurveyChartPublic } from './components'
import { UnfinishedExperimentsModal } from './components/UnfinishedExperimentsModal'
import { FirefoxWarningModal } from './components/FirefoxWarningModal'
import { db } from '@/db'
import { TextLink } from '@/components/catalyst/text'
import { SOCIAL_MEDIA_LINKS } from '@/lib'
import { EXPERIMENTS } from './utils'

export default function DissonanceSurveyPage() {
  return (
    <Container className="mt-16 lg:mt-32">
      <FirefoxWarningModal />
      <db.SignedIn>
        <UnfinishedExperimentsModal />
      </db.SignedIn>
      <Container>
        <header>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Sensory dissonance analysis
          </h1>
        </header>
        <Prose>
          <CollapsibleDescription>
            <p>
              This experiment is based on the classic work by{' '}
              <TextLink
                href="https://www.mpi.nl/world/materials/publications/levelt/Plomp_Levelt_Tonal_1965.pdf"
                target="_blank"
              >
                Plomp & Levelt
              </TextLink>
              , that made an important contribution to the modern psychoacoustic
              research by introducing the concept of sensory dissonance of pure
              sinewaves and its dependency on musical intervals. Sensory
              dissonance refers to the quality of a sound that is rough,
              unpleasant and unstable. Its dependency on musical interval has
              found its practical application in the work of William Sethares{' '}
              <TextLink
                href="https://www.r-5.org/files/books/rx-music/tuning/William_A_Sethares-Tuning_Timbre_Spectrum_Scale-EN.pdf"
                target="_blank"
              >
                Tuning, Timbre, Spectrum, Scale
              </TextLink>
              . Sethares used results of Plomp and Levelt&apos;s experiment to
              calculate dissonance curves, which can be used to extract tuning
              from the timbre of musical instruments. He showed how dissonance
              curves predict most common musical chords, how they can be used to
              build dynamic tuning systems or to tune inharmonic instruments.
            </p>

            <p>
              Below you can see a set of graphs that show that dependency of
              sensory dissonance vs musical interval for different registers.
              Each line on the graph is the result of a real person listening to
              intervals and rating how rought or smooth those intervals sound to
              them. You can take part in that experiment too! Sign in and find
              out your own dissonance preference and compare it with others. It
              takes only 5 minutes to complete and both musicians and
              non-musicians are welcome to participate.
            </p>
          </CollapsibleDescription>

          <div className="h-4 md:h-2" />

          <db.SignedOut>
            <SurveyChartPublic
              meanFrequency={EXPERIMENTS[0].frequency}
              title={EXPERIMENTS[0].title}
            />
          </db.SignedOut>
          <db.SignedIn>
            <SurveyChart
              meanFrequency={EXPERIMENTS[0].frequency}
              title={EXPERIMENTS[0].title}
            />
          </db.SignedIn>

          <db.SignedOut>
            <SurveyChartPublic
              meanFrequency={EXPERIMENTS[1].frequency}
              title={EXPERIMENTS[1].title}
            />
          </db.SignedOut>
          <db.SignedIn>
            <SurveyChart
              meanFrequency={EXPERIMENTS[1].frequency}
              title={EXPERIMENTS[1].title}
            />
          </db.SignedIn>

          <db.SignedOut>
            <SurveyChartPublic
              meanFrequency={EXPERIMENTS[2].frequency}
              title={EXPERIMENTS[2].title}
            />
          </db.SignedOut>
          <db.SignedIn>
            <SurveyChart
              meanFrequency={EXPERIMENTS[2].frequency}
              title={EXPERIMENTS[2].title}
            />
          </db.SignedIn>

          <h2>Discrepancies with the original experiment</h2>

          <p>
            The results of Plomp and Levelt were not recieved without cotroversy
            because they deviated from the scientific and musical consensus at
            that time. That was not due to the mistake but because Plomp and
            Levelt intentionally modified their experiments in a way that was
            not done before:
          </p>
          <ol>
            <li>
              The experiment specifically targeted{' '}
              <strong>not musicians</strong>. All participants were people from
              the general public without any musical training.
            </li>
            <li>
              The set of intervals that were used in the experiment was{' '}
              <strong>not based on 12TET nor on simple ratios</strong>. This was
              important to exclude previous training or previous cultural
              experience from the results and get the raw sensory data.
            </li>
            <li>
              Another important aspect was that they used{' '}
              <strong>pure sinewaves</strong> to conduct listening experiments,
              that was done to exclude the role that timbre might play in the
              perception of dissonance.
            </li>
            <li>
              Finally, when rating the intervals, participants were asked to
              rate each interval on a 7-point scale of consonant - dissonant
              where <strong>the score of 7 is most consonant</strong>. The
              meaning of consonance interval was defined as
              &quot;beautiful&quot; and &quot;euphonious&quot;.
            </li>
          </ol>

          <p>
            In this experiment we attempt to replicate the approach of Plomp and
            Levelt. Because the experiments are not conducted in controlled
            laboratory environment, the results will not bear the same
            scientific rigor as the original research, but it is still
            interesting to see how it will compare. There are several
            differences between the original experiment and this one:
          </p>
          <ol>
            <li>
              Because the experiment is conducted online, we welcome
              participants with <strong>any musical background</strong>.
            </li>
            <li>
              We flip the 7-point scale to be more consistent with the work of
              Sethares. In our experiment{' '}
              <strong>the score of 7 is maximum dissonance</strong>.
            </li>
            <li>
              We never use the word &quot;consonance&quot; or
              &quot;dissonance&quot; in the experiment. Instead,
              <strong>
                {' '}
                we use terms like &quot;smooth&quot; and &quot;rough&quot;{' '}
              </strong>{' '}
              to describe the intervals. We believe that this is more suitable
              for broader audience that may include professional musicians as
              well as non-musicians, as their definitions and perceptions of
              consonance and dissonance may differ.
            </li>
          </ol>
          <p>
            In other aspects the experiments are very similar. We hope that
            gathered data will help us to build new tools to enable microtonal
            experiments. But most of all we hope to educate people about the
            topic of sensory dissonance and its connection to the problem of
            musical tuning.
          </p>
          <p>
            To follow the development and application of this experiment you can
            subscribe to our YouTube channel, consider following development on
            Github, and reach out if you have any questions or suggestions on
            email:
          </p>
        </Prose>
        <div className="flex flex-col gap-2">
          <SocialLink href={SOCIAL_MEDIA_LINKS.youtube} icon={YouTubeIcon}>
            YouTube
          </SocialLink>
          <SocialLink href={SOCIAL_MEDIA_LINKS.github} icon={YouTubeIcon}>
            Github
          </SocialLink>
          <SocialLink href="mailto:info@newtonality.net" icon={MailIcon}>
            info@newtonality.net
          </SocialLink>
        </div>
      </Container>
    </Container>
  )
}
