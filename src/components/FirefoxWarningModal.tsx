'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogDescription,
} from '@/components/catalyst/dialog'
import { Button } from '@/components/Button'
import { Text } from '@/components/catalyst/text'

const STORAGE_KEY = 'firefox-warning-dismissed-v2'
const GHOST_CLOSE_MS = 400

function isFirefox(): boolean {
  if (typeof navigator === 'undefined') return false

  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('firefox') || ua.includes('fxios')) return true

  try {
    return CSS.supports('-moz-appearance', 'none') && !ua.includes('webkit')
  } catch {
    return false
  }
}

function wasDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function persistDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY, 'true')
  } catch {
    // Privacy modes can block storage; still allow dismissing for this visit.
  }
}

export function FirefoxWarningModal() {
  const pathname = usePathname()
  const [modalOpen, setModalOpen] = useState(false)
  const openedAtRef = useRef(0)

  const isToolsRoute = pathname.startsWith('/tools')

  useEffect(() => {
    if (!isToolsRoute || !isFirefox() || wasDismissed()) {
      setModalOpen(false)
      return
    }

    const timer = window.setTimeout(() => {
      openedAtRef.current = Date.now()
      setModalOpen(true)
    }, 1500)

    return () => window.clearTimeout(timer)
  }, [isToolsRoute])

  const handleDismiss = () => {
    if (Date.now() - openedAtRef.current < GHOST_CLOSE_MS) {
      return
    }

    setModalOpen(false)
    persistDismissed()
  }

  return (
    <Dialog open={modalOpen} onClose={handleDismiss} size="md">
      <DialogTitle>Browser Compatibility Notice</DialogTitle>
      <DialogDescription>
        We apologize for any inconvenience you may experience.
      </DialogDescription>

      <DialogBody>
        <Text>
          If you experience problems with sounds, clicking, or any other
          unexpected behavior while using these apps, please try switching to
          Chrome or Chromium based browsers. We apologize for the inconsistency
          and are working to improve browser compatibility.
        </Text>
      </DialogBody>

      <DialogActions>
        <Button variant="primary" onClick={handleDismiss}>
          Understood
        </Button>
      </DialogActions>
    </Dialog>
  )
}
