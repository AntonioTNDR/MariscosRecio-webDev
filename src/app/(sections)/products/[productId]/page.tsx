import { Types } from 'mongoose'
import { notFound } from 'next/navigation'
import { getCart, getProductById } from '@/lib/handlers'
import { useState } from 'react'
import CartItemCounter from '@/components/CartItemCounter'
import { getSession } from '@/lib/auth'



export default async function Product({
  params,
}: {
  params: { productId: string }
}) {
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound()
  }

  let qty = 0;

  const productData = await getProductById(params.productId)
  if (productData === null) {
    notFound()
  }

  
  const session = await getSession()
  
  // Get cart data if user is authenticated
  if (session) {
    const cartData = await getCart(session.userId)
    if (cartData) {
      const cartItem = cartData.cartItems.find(
        (item) => item.product._id.toString() === params.productId
      )
      if (cartItem) {
        qty = cartItem.qty
      }
    }
  }

  // Extract the product details
  // I made this since getProductById returns an array of products, so that 
  // we can reuse the same handler for multiple product IDs in the future.
  const product = productData.products[0]
  
  return (
    <div className='flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0'>
      {/* Imagen - izquierda en pantallas grandes, arriba en móvil */}
      <div className='flex flex-col lg:w-1/2 space-y-4'>
        <img 
          src={product.image}
          alt={product.name}
          className='w-full h-auto object-cover object-center rounded-lg'
        />
        
        {session && (
          <CartItemCounter
            userId={session.userId}
            productId={product._id.toString()}
            value={qty}
          />
        )}
      </div>

      {/* Información del producto - derecha en pantallas grandes, abajo en móvil */}
      <div className='flex flex-col space-y-6 lg:w-1/2'>
        <div className='flex flex-col'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
            {product.name}
          </h1>
        </div>

        <div className='flex flex-col'>
          <p className='text-lg text-gray-700 dark:text-gray-300'>
            {product.description}
          </p>
        </div>

        <div className='flex flex-col'>
          <p className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>
            {product.price.toFixed(2)} €
          </p>
        </div>
      </div>
    </div>
  )
}