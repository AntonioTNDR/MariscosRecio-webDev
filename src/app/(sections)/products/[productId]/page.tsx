import { Types } from 'mongoose'
import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/handlers'

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

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        {product.name}
      </h3>
      {product.description && <p>{product.description}</p>}
      {/* Here you should show the details of the product. */}
    </div>
  )
}