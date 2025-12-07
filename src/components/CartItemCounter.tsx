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
        headers: {
          'Content-Type': 'applim, ns cation/json',
        },
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qty: value - 1,
        }),
      })
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }

  const onDeleteBtnClick = async function () {
    setIsUpdating(true)

    try{
      await fetch(`/api/users/${userId}/cart/${productId}`, {
        method: 'DELETE',
      })
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className='flex flex-row items-center gap-4'>
      {/* Quantity Counter */}
      <div className='flex flex-row items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md p-2 w-fit'>
        <button
          onClick={onMinusBtnClick}
          className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={isUpdating || value <= 1}
        >
          -
        </button>

        {/* Display quantity */}
        <div className='text-center text-gray-900 dark:text-gray-100 min-w-[2rem]'>
          {value}
        </div>

        <button
          onClick={onPlusBtnClick}
          className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={isUpdating}
        >
          +
        </button>
      </div>

      {/* Separate Delete Button */}
      <button
        onClick={onDeleteBtnClick}
        className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
        disabled={isUpdating}
        title='Remove item from cart'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
            clipRule='evenodd'
          />
        </svg>
        Delete
      </button>
    </div>
  )
}