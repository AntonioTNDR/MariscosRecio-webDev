import { redirect } from 'next/navigation'
import { CartItem } from '@/models/User'
import { getCart } from '@/lib/handlers'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { Product } from '@/models/Product'
import { Types } from 'mongoose'

// Define the populated cart item type
interface PopulatedCartItem {
  product: Product & { _id: Types.ObjectId }
  qty: number
}

// Define the populated cart response type
interface PopulatedCartResponse {
  cartItems: PopulatedCartItem[]
}

export default async function Cart() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  const cartData = await getCart(session.userId) as PopulatedCartResponse | null
  if (!cartData) {
    redirect('/auth/signin')
  }

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        My Shopping Cart
      </h3>
      {cartData.cartItems.length === 0 ? (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>The cart is empty</span>
        </div>
      ) : (
        <>
          {cartData.cartItems.map((cartItem) => (
            <div key={cartItem.product._id.toString()}>
              <Link href={`/products/${cartItem.product._id.toString()}`}>
                {cartItem.product.name}
              </Link>
              <br />
              {cartItem.qty}
              <br />
              {cartItem.product.price.toFixed(2) + ' €'}
            </div>
          ))}
        </>
      )}
    </div>
  )
}