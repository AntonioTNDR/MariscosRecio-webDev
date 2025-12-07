import { redirect } from 'next/navigation'
import { CartItem } from '@/models/User'
import { getCart } from '@/lib/handlers'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { Product } from '@/models/Product'
import { Types } from 'mongoose'
import CartItemCounter from '@/components/CartItemCounter'

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

  // Calculate total price
  const totalPrice = cartData.cartItems.reduce((total, item) => {
    return total + (item.product.price * item.qty)
  }, 0)

  return (
    <div className='flex flex-col max-w-4xl mx-auto'>
      <h3 className='pb-6 text-3xl font-bold text-gray-900 dark:text-gray-100'>
        My Shopping Cart
      </h3>
      {cartData.cartItems.length === 0 ? ( // Show message if cart is empty
        <div className='text-center py-12'>
          <span className='text-sm text-gray-400'>The cart is empty</span>
        </div>
      ) : ( // Show cart items if cart is not empty
        <div className='space-y-6'>
          {/* Cart Items */}
          <div className='space-y-4'>
            {cartData.cartItems.map((cartItem) => ( // Render each cart item
              <div 
                key={cartItem.product._id.toString()}
                className='flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'
              >
                {/* Product Image */}
                <Link 
                  href={`/products/${cartItem.product._id.toString()}`}
                  className='flex-shrink-0'
                >
                  <img 
                    src={cartItem.product.image}
                    alt={cartItem.product.name}
                    className='w-24 h-24 object-cover rounded-md'
                  />
                </Link>
                
                {/* Product Info */}
                <div className='flex-1 min-w-0'>
                  <Link 
                    href={`/products/${cartItem.product._id.toString()}`}
                    className='text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400'
                  >
                    {cartItem.product.name}
                  </Link>
                  
                </div>

                {/* Cart Counter and Price */}
                <div className='flex flex-col items-end gap-3'>
                  {/*Add or remove quantity of products*/}
                  <CartItemCounter
                    userId={session.userId}
                    productId={cartItem.product._id.toString()}
                    value={cartItem.qty}
                  />
                  
                  {/* Price */}
                  <p className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                    {(cartItem.product.price * cartItem.qty).toFixed(2)} €
                  </p>
                </div>
                
              </div>
            ))}
          </div>

          {/* Total Section */}
          <div className='border-t border-gray-300 dark:border-gray-600 pt-4'>
            <div className='flex justify-between items-center mb-6'>
              <span className='text-xl font-bold text-gray-900 dark:text-gray-100'>Total:</span>
              <span className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                {totalPrice.toFixed(2)} €
              </span>
            </div>

            {/* Check out Button */}
            <Link 
              href='/chekout'
              className='block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-6 rounded-md font-semibold transition-colors'
            >
              Check out
            </Link>

            <p className='text-xs text-gray-500 dark:text-gray-400 text-center mt-4'>
              VAT included and free delivery
            </p>
          </div>
        </div>
      )}
    </div>
  )
}