'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Container } from '../Container'
import { clamp } from '@/lib'
import { Avatar, AvatarContainer } from './Avatar'
import { MobileNavigation } from './MobileNavigation'
import { DesktopNavigation } from './DesktopNavigation'
import { NAV_ITEMS } from '@/lib/const'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Button } from '../Button'
import { HeaderButton } from './HeaderButton'

export function Header() {
  let isHomePage = usePathname() === '/'

  let headerRef = useRef<React.ElementRef<'div'>>(null)
  let avatarRef = useRef<React.ElementRef<'div'>>(null)
  let isInitial = useRef(true)

  useEffect(() => {
    let downDelay = avatarRef.current?.offsetTop ?? 0
    let upDelay = 64

    function setProperty(property: string, value: string) {
      document.documentElement.style.setProperty(property, value)
    }

    function removeProperty(property: string) {
      document.documentElement.style.removeProperty(property)
    }

    function updateHeaderStyles() {
      if (!headerRef.current) {
        return
      }

      let { top, height } = headerRef.current.getBoundingClientRect()
      let scrollY = clamp(
        window.scrollY,
        0,
        document.body.scrollHeight - window.innerHeight,
      )

      if (isInitial.current) {
        setProperty('--header-position', 'sticky')
      }

      setProperty('--content-offset', `${downDelay}px`)

      if (isInitial.current || scrollY < downDelay) {
        setProperty('--header-height', `${downDelay + height}px`)
        setProperty('--header-mb', `${-downDelay}px`)
      } else if (top + height < -upDelay) {
        let offset = Math.max(height, scrollY - upDelay)
        setProperty('--header-height', `${offset}px`)
        setProperty('--header-mb', `${height - offset}px`)
      } else if (top === 0) {
        setProperty('--header-height', `${scrollY + height}px`)
        setProperty('--header-mb', `${-scrollY}px`)
      }

      if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
        setProperty('--header-inner-position', 'fixed')
        removeProperty('--header-top')
        removeProperty('--avatar-top')
      } else {
        removeProperty('--header-inner-position')
        setProperty('--header-top', '0px')
        setProperty('--avatar-top', '0px')
      }
    }

    function updateAvatarStyles() {
      if (!isHomePage) {
        return
      }

      let fromScale = 1
      let toScale = 36 / 64
      let fromX = 0
      let toX = 2 / 16

      let scrollY = downDelay - window.scrollY

      let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale
      scale = clamp(scale, fromScale, toScale)

      let x = (scrollY * (fromX - toX)) / downDelay + toX
      x = clamp(x, fromX, toX)

      setProperty(
        '--avatar-image-transform',
        `translate3d(${x}rem, 0, 0) scale(${scale})`,
      )

      let borderScale = 1 / (toScale / scale)
      let borderX = (-toX + x) * borderScale
      let borderTransform = `translate3d(${borderX}rem, 0, 0) scale(${borderScale})`

      setProperty('--avatar-border-transform', borderTransform)
      setProperty('--avatar-border-opacity', scale === toScale ? '1' : '0')
    }

    function updateStyles() {
      updateHeaderStyles()
      updateAvatarStyles()
      isInitial.current = false
    }

    updateStyles()
    window.addEventListener('scroll', updateStyles, { passive: true })
    window.addEventListener('resize', updateStyles)

    return () => {
      window.removeEventListener('scroll', updateStyles)
      window.removeEventListener('resize', updateStyles)
    }
  }, [isHomePage])

  return (
    <header
      className="pointer-events-none relative z-50 flex flex-none flex-col"
      style={{
        height: 'var(--header-height)',
        marginBottom: 'var(--header-mb)',
      }}
    >
      <div
        ref={headerRef}
        className="top-0 z-10 h-16 pt-6"
        style={{
          position: 'var(--header-position)' as React.CSSProperties['position'],
        }}
      >
        <Container
          className="top-(--header-top,--spacing(6)) w-full"
          style={{
            position:
              'var(--header-inner-position)' as React.CSSProperties['position'],
          }}
        >
          <div className="relative flex gap-4">
            <div className="flex flex-1">
              <AvatarContainer>
                <Avatar />
              </AvatarContainer>
            </div>
            <div className="flex flex-1 justify-end md:justify-center">
              <MobileNavigation
                items={NAV_ITEMS}
                className="pointer-events-auto md:hidden"
              />
              <DesktopNavigation
                items={NAV_ITEMS}
                className="pointer-events-auto hidden md:block"
              />
            </div>
            <div className="flex justify-end md:flex-1">
              <div className="pointer-events-auto flex gap-3">
                <SignedOut>
                  <SignInButton>
                    <HeaderButton variant="secondary">Sign In</HeaderButton>
                  </SignInButton>
                  <SignUpButton>
                    <HeaderButton variant="primary">Sign Up</HeaderButton>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </header>
  )
}
