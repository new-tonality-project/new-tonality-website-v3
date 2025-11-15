'use client'

import { Prose } from '@/components'
import { TextLink } from '@/components/catalyst/text'

export function SurveyOverview() {
  return (
    <Prose>
      <p>
        Thank You for taking part in the experiment! Our goal it to determine how
        dissonant do you percieve different intervals on the scale from 1 to 7,
        where 1 is the least and 7 is the most dissonant. You will rate
        14 random intervals that are chosen to be within the range of 1 octave.
        The experiment usually takes less that 5 minutes to complete and is done
        in several steps:
      </p>
      <ol>
        <li>
          <strong>Answer couple of questions:</strong> We need to know your
          musical background and have your permission to share the results of
          the experiment within New Tonality project.
        </li>
        <li>
          <strong>Test volume and speakers:</strong> You have to make sure that
          you can hear the intervals clearly at a comfortable volume. Please use
          headphones or monitoring speakers. Laptop or phone speakers, even good
          Macbook Pro ones, produce a lot of distorion and are introducing new
          harmonics that will impact the results of the experiment.
        </li>
        <li>
          <strong>Preliminary listening:</strong> Before rating the intervals,
          you need to get accustomed with how they sound. To do it you will have
          to listen to all 14 intervals in the random order without the need to
          rate them. That will give you an idea which intervals may sound like 7
          or 1.
        </li>
        <li>
          <strong>Rating intervals:</strong> Finnaly you will be presented with
          a set of intervals that you will need to listen and rate. There only
          will be the same 14 intervals that you have listened to in the
          previous step. However, to make sure the results are statistically
          valid, each interval will played 3 times in a random order, so in
          total you will rate 42 intervals.
        </li>
      </ol>
      <p>
        After you rate all the intervals, the results will be sent to our server
        to be shared on the results page. You can exit the experiment at any time,
        but you will loose all your progress.
      </p>
      <p>Let's start the experiment!</p>
    </Prose>
  )
}
