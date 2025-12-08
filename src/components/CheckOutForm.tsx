'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CheckOutFormProps {
  userId: string
}

interface FormValues {
  address: string
  cardHolder: string
  cardNumber: string
}

export default function CheckOutForm({ userId }: CheckOutFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [formValues, setFormValues] = useState<FormValues>({
    address: '',
    cardHolder: '',
    cardNumber: '',
  })

  const handleSubmit = async function (
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    if (!event.currentTarget.checkValidity()) {
      return false
    }
    const res = await fetch(`/api/users/${userId}/orders`, {
      method: 'POST',
      body: JSON.stringify({
        ...formValues,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      const orderId = data._id
      setError('')
      router.push(`/orders/${orderId}`)
      router.refresh()
    } else {
      const data = await res.json()
      if (data.error === 'WRONG_PARAMETERS') {
        setError(`Please check your input and try again.`)
      } else {
        setError(
          'An error occurred while processing your request. Please try again later.'
        )
      }
    }
  }

  return (
    <form className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6' onSubmit={handleSubmit} noValidate>
      <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
      Shipping & Payment Information
      </h2>
      
      <div className='space-y-6 mt-8'>
        {/* Shipping address */}
        <div>
          <label
            htmlFor='shippingAddress'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Shipping address:
          </label>
          <input
            id='address'
            name='address'
            type='text'
            autoComplete='address'
            placeholder='123 Main St, Springfield, USA'
            required
            value={formValues.address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormValues((prevFormValues) => ({
                ...prevFormValues,
                address: e.target.value,
              }))
            }
            className='w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Card Holder*/}
          <div>
          <label 
            htmlFor='cardHolder' 
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
          >
            Card Holder
          </label>
          <input
            type='text'
            id='cardHolder'
            name='cardHolder'
            placeholder='Foo Bar'
            autoComplete='current-password'
            required
            value={formValues.cardHolder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormValues((prevFormValues) => ({
                ...prevFormValues,
                cardHolder: e.target.value,
              }))
          }
            className='w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
          </div>

          {/* Card Number */}
          <div>
            <label 
              htmlFor='cardNumber' 
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
            >
              Card Number
            </label>
            <input
              type='text'
              id='cardNumber'
              name='cardNumber'
              required
              //pattern='[0-9]{16}'
              maxLength={16}
              value={formValues.cardNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormValues((prevFormValues) => ({
                  ...prevFormValues,
                  cardNumber: e.target.value,
                }))
              }
              placeholder='0000111122223333'
              className='w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
          </div>
        </div>
        
        {/* Submit button */}
        <div className='flex justify-center pt-4'>
          <button 
            type='submit' 
            className='rounded-md bg-gray-900 dark:bg-gray-700 px-8 py-3 text-sm font-semibold text-white hover:bg-gray-800 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'
            >
            Purchase
          </button>
        </div>
      </div>
    </form>
  )
}