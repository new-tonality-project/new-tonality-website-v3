'use client'

import { db } from '@/db'
import { useAuth, useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function InstantDBAuthSync() {
  const { isSignedIn } = useUser()
  const { getToken } = useAuth()
  const { user: instantUser, isLoading: isInstantLoading } = db.useAuth()

  useEffect(() => {
    if (isInstantLoading) return

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
      return
    }

    // Clerk is signed out. InstantDB persists guest sessions in the browser,
    // so keep an existing guest rather than signing out and creating a new one.
    if (instantUser?.isGuest) {
      return
    }

    if (instantUser) {
      db.auth
        .signOut()
        .then(() => db.auth.signInAsGuest())
        .catch((error) => {
          console.error('Error switching to guest auth', error)
        })
      return
    }

    db.auth.signInAsGuest().catch((error) => {
      console.error('Error signing in as guest', error)
    })
  }, [isSignedIn, isInstantLoading, instantUser?.id, instantUser?.isGuest, getToken])

  return null
}
