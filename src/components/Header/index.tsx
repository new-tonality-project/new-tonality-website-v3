'use client'

import { Container } from '../Container'
import { Logo } from './Logo'
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
import { HeaderButton } from './HeaderButton'

export function Header() {
  return (
    <header
      className="pointer-events-none relative z-50 flex flex-none flex-col"
      style={{
        height: 'var(--header-height)',
        marginBottom: 'var(--header-mb)',
      }}
    >
      <div
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
              <Logo />
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
              <div className="w pointer-events-auto flex gap-3">
                <SignedOut>
                  <SignInButton>
                    <HeaderButton variant="secondary">Sign In</HeaderButton>
                  </SignInButton>
                  <SignUpButton>
                    <HeaderButton variant="primary">Sign Up</HeaderButton>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: '!w-10 !h-10',
                      },
                    }}
                  />
                </SignedIn>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </header>
  )
}
