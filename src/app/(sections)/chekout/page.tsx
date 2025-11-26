import { redirect } from 'next/navigation'
import { CartItem } from '@/models/User'
import { getCart } from '@/lib/handlers'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { Product } from '@/models/Product'
import { Types } from 'mongoose'

interface PopulatedCartItem {
  product: Product & { _id: Types.ObjectId }
  qty: number
}

// Define the populated cart response type
interface PopulatedCartResponse {
  cartItems: PopulatedCartItem[]
}


export default async function CheckoutPage() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }
  const cartData = await getCart(session.userId) as PopulatedCartResponse | null
  if (!cartData) {
    redirect('/auth/signin')
  }

  // Calculate total price
  const totalPrice = cartData.cartItems.reduce((total, item) => {
    return total + (item.product.price * item.qty)
  }, 0)
  
  return(
    <div className='flex flex-col max-w-4xl mx-auto'>
      <h3 className='pb-6 text-3xl font-bold text-gray-900 dark:text-gray-100'>
        Checkout
      </h3>
    </div>
  )
}