'use client'

import { db } from '@/db'
import { useAuth, useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function InstantDBAuthSync() {
  const { isSignedIn } = useUser()
  const { getToken } = useAuth()

  useEffect(() => {
    if (isSignedIn) {
      getToken()
        .then((token) => {
          db.auth.signInWithIdToken({
            clientName: process.env.NEXT_PUBLIC_CLERK_CLIENT_NAME as string,
            idToken: token as string,
          })
        })
        .catch((error) => {
          console.error('Error signing in with Instant', error)
        })
    } else {
      db.auth.signOut()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn])

  return null
}
