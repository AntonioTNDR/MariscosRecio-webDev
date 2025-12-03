'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { set } from 'mongoose'

interface CartItemCounterProps {
userId: string
productId: string
value: number
}

export default function CartItemCounter({
  userId,
  productId,
  value,
}: CartItemCounterProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

    const onPlusBtnClick = async function () {
    setIsUpdating(true)

    try {
      await fetch(`/api/users/${userId}/cart/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({
          qty: value + 1,
        }),
      })
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }

  const onMinusBtnClick = async function () {
    setIsUpdating(true)

    try {
      await fetch(`/api/users/${userId}/cart/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({
          qty: value - 1,
        }),
      })
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className='flex flex-row items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md p-2 w-fit'>
          <button
            onClick={onMinusBtnClick}
            className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition'
            disabled={isUpdating || value <= 0}
          >
            -
          </button>

          {/* Display quantity */}
          <div className='text-center text-gray-900 dark:text-gray-100 min-w-[2rem]'>
            {value}
          </div>

          <button
            onClick={onPlusBtnClick}
            className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition'
            disabled={isUpdating}
          >
            +
          </button>
        </div>
  )
}