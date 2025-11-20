import { redirect } from 'next/navigation'
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

export default async function Checkout() {
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

  const isCartEmpty = cartData.cartItems.length === 0

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        Checkout
      </h3>

      <div className='flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0'>
        {/* Cart Summary - Left Side */}
        <div className='flex flex-col lg:w-1/2 space-y-4'>
          <h4 className='text-2xl font-semibold text-gray-900'>Order Summary</h4>
          
          {isCartEmpty ? (
            <div className='text-center py-8'>
              <span className='text-sm text-gray-400'>The cart is empty</span>
              <br />
              <Link 
                href='/' 
                className='mt-4 inline-block text-blue-600 hover:text-blue-800 underline'
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <>
              <div className='space-y-4'>
                {cartData.cartItems.map((cartItem) => (
                  <div 
                    key={cartItem.product._id.toString()}
                    className='flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow'
                  >
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
                    
                    <div className='flex-1 min-w-0'>
                      <Link 
                        href={`/products/${cartItem.product._id.toString()}`}
                        className='text-lg font-medium text-gray-900 hover:text-blue-600 block'
                      >
                        {cartItem.product.name}
                      </Link>
                      <p className='text-sm text-gray-500 mt-1'>
                        Quantity: {cartItem.qty}
                      </p>
                      <p className='text-lg font-semibold text-gray-900 mt-2'>
                        {(cartItem.product.price * cartItem.qty).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Price */}
              <div className='border-t border-gray-300 pt-4 mt-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-2xl font-bold text-gray-900'>Total:</span>
                  <span className='text-2xl font-bold text-gray-900'>
                    {totalPrice.toFixed(2)} €
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Checkout Form - Right Side */}
        <div className='flex flex-col lg:w-1/2'>
          <h4 className='text-2xl font-semibold text-gray-900 mb-4'>Shipping & Payment</h4>
          
          <form className='space-y-6'>
            {/* Shipping Address Section */}
            <div className='space-y-4'>
              <h5 className='text-lg font-medium text-gray-900 border-b border-gray-300 pb-2'>
                Shipping Address
              </h5>
              
              <div>
                <label 
                  htmlFor='address' 
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Full Address *
                </label>
                <input
                  type='text'
                  id='address'
                  name='address'
                  required
                  disabled={isCartEmpty}
                  placeholder='123 Main St, 12345 City, Country'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            {/* Payment Information Section */}
            <div className='space-y-4'>
              <h5 className='text-lg font-medium text-gray-900 border-b border-gray-300 pb-2'>
                Payment Information
              </h5>
              
              <div>
                <label 
                  htmlFor='cardHolder' 
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Card Holder *
                </label>
                <input
                  type='text'
                  id='cardHolder'
                  name='cardHolder'
                  required
                  disabled={isCartEmpty}
                  placeholder='John Doe'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
                />
              </div>

              <div>
                <label 
                  htmlFor='cardNumber' 
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Card Number *
                </label>
                <input
                  type='text'
                  id='cardNumber'
                  name='cardNumber'
                  required
                  disabled={isCartEmpty}
                  placeholder='1234 5678 9012 3456'
                  maxLength={16}
                  pattern='[0-9]{16}'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className='pt-4'>
              {isCartEmpty ? (
                <button
                  type='button'
                  disabled
                  className='w-full bg-gray-400 text-white py-3 px-6 rounded-md font-semibold cursor-not-allowed'
                >
                  Complete Purchase
                </button>
              ) : (
                <button
                  type='submit'
                  className='w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-300'
                >
                  Complete Purchase
                </button>
              )}
            </div>

            <p className='text-xs text-gray-500 text-center mt-4'>
              * This is a demo form. No actual purchase will be processed.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}