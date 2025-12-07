'use client'

import { ReactNode } from 'react'

export const navbarButtonClasses =
  'rounded-full p-2 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-white';
interface NavbarSignOutButtonProps {
  children: ReactNode
}

export default function NavbarSignOutButton({ children }: NavbarSignOutButtonProps) {
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
      })
      
      // Check if current page requires authentication
      const currentPath = window.location.pathname
      const protectedPaths = ['/cart', '/orders', '/profile']
      const isProtectedPage = protectedPaths.some(path => currentPath.startsWith(path))
      
      if (isProtectedPage) {
        // Redirect to home page if on a protected page
        window.location.href = '/'
      } else {
        // Just refresh the current page
        window.location.reload()
      }
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  return (
    <button onClick={handleSignOut} className={navbarButtonClasses}>
      {children}
    </button>
  )
}