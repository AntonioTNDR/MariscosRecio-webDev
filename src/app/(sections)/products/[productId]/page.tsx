import { Types } from 'mongoose'
import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/handlers'
import { useState } from 'react'



export default async function Product({
  params,
}: {
  params: { productId: string }
}) {
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound()
  }

  const productData = await getProductById(params.productId)
  if (productData === null) {
    notFound()
  }



  // Extract the product details
  // I made this since getProductById returns an array of products, so that 
  // we can reuse the same handler for multiple product IDs in the future.
  const product = productData.products[0]

  // Placeholder for quantity logic
  // let qty = 0

  return (
    <div className='flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0'>
      {/* Imagen - izquierda en pantallas grandes, arriba en móvil */}
      <div className='flex flex-col lg:w-1/2 space-y-4'>
        <img 
          src={product.image}
          alt={product.name}
          className='w-full h-auto object-cover object-center rounded-lg'
        />
        <div className='flex flex-row items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md p-2 w-fit'>
                  <button
                    // onClick={() => {
                    //   if (qty > 0) {  // Only decrease if qty is greater than 0
                    //     qty = qty - 1
                    //   }
                    // }}
                    className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition'
                  >
                    -
                  </button>

                  {/* Display quantity */}
                  <div className='text-center text-gray-900 dark:text-gray-100 min-w-[2rem]'>
                    aquí iría la cantidad
                    {/*qty*/}
                  </div>

                  <button
                    //onClick={() => qty = qty + 1}
                    className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition'
                  >
                    +
                  </button>
                </div>

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