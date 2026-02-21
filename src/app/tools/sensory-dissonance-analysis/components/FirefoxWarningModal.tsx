'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogDescription,
} from '@/components/catalyst/dialog'
import { Button } from '@/components'
import { Text } from '@/components/catalyst/text'

const STORAGE_KEY = 'firefox-warning-dismissed'

function isFirefox(): boolean {
  if (typeof window === 'undefined') return false
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1
}

export function FirefoxWarningModal() {
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    // Check if user is on Firefox and hasn't dismissed the warning
    if (isFirefox()) {
      const hasBeenDismissed = localStorage.getItem(STORAGE_KEY) === 'true'
      if (!hasBeenDismissed) {
        // Small delay to ensure page is loaded
        const timer = setTimeout(() => {
          setModalOpen(true)
        }, 500)

        return () => clearTimeout(timer)
      }
    }
  }, [])

  const handleDismiss = () => {
    setModalOpen(false)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  if (!isFirefox()) {
    return null
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
          unexpected behavior while using this tool, please try switching to
          Chrome. We apologize for the inconsistency and are working to improve
          browser compatibility.
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
