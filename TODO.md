# TODO

DONE: generate intervals to use in the survey
DONE: add charting library
3. have ability to play intervals with web synth (publish compiled ts)
4. have a flow of fillign up the consonance of intervals
5. randomize the order of intervals in the survey
6. have multiple passes of the survey
7. determine statistical correctness of answers
8. register rusults with BE
9. add lower and higher frequencies to survey
10. add results pages
...


# Flow

## Initial Page
1. You see the results of the survey
2. You need to be logged in to take the survey, if looged in you see CTA to start
3. Pressing start, redirects to protected route with a survey

## Preparation
1. Survey start with the description of what has to be done and a link to P&L article
2. next stem is make sure you have headphones or decent speakers
3. Question: Do you agree that your results may be publicly shared on the results page - "I Agree" (we not going to share you user info, it is anonymous)

## Survey starts
1. Explain that there are 3 - 5 independent experiments for each octave. And let a person choose
2. Now we are going to present sounds that you will need to rate 1 - 7, where 1 is smooth 7 is rough
3. Play sounds, ask if ready to start? You cannot go back, if you cancel all progress will be lost
4. Start playing sounds, do 5 repeats and show a progress bar
5. After finish, analyze if statistically correct, if not show message about what that means
6. Show the individual result for that frequency band and the ability to go throgh the other bands


User can see their results in that tool, not on user page.

How do we do a survey? The idea is that user can play and stop at will. Do we need a pause like in the paper or no? test on yourself.

Start from the survey itself, and build around it.

User cannot redo, if they want they need to send an email and we are gonna talk about it.