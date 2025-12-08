import React, { ReactNode } from 'react'
import { navbarButtonClasses } from '@/components/NavbarButton'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { getCart } from '@/lib/handlers'
import { redirect } from 'next/navigation'

interface NavbarCartButtonProps {
  children: ReactNode
}

export default async function NavbarCartButton({
  children,
}: NavbarCartButtonProps) {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  const cartItemsData = await getCart(session.userId)
  if (!cartItemsData) {
    redirect('/auth/signin')
  }

  return (
    <Link
      href={'/cart'}
      className={`relative inline-flex ${navbarButtonClasses}`}
    >
      {children}
      <div className='absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white dark:border-gray-900'>
        {cartItemsData.cartItems.reduce(
          (partialSum, cartItem) => partialSum + cartItem.qty,
          0
        )}
      </div>
    </Link>
  )
}