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

  const isCartEmpty = cartData.cartItems.length === 0
  
  return(
    <div className='flex flex-col max-w-4xl mx-auto'>
      <h3 className='pb-6 text-3xl font-bold text-gray-900 dark:text-gray-100'>
        Checkout
      </h3>
      {/*Cart Items sections*/}
      <div className='flex flex-col space-y-4'>
        <h3 className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>
          Order Summary
        </h3>
        
        {isCartEmpty ? (
          <div className='flex flex-col space-y-4'>
            <p className='text-gray-600 dark:text-gray-400'>
              Your cart is empty.
            </p>
            {/* Link to products page */}
            <Link href='/' className='mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/*Order summary*/}
            <div className='overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow'>
              <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                <thead className='bg-gray-50 dark:bg-gray-900'>
                  <tr>
                      <th scope = 'col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Product Name
                      </th>
                      <th scope = 'col' className='px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Quantity
                      </th>
                      <th scope = 'col' className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Price
                      </th>
                      <th scope = 'col' className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Total
                      </th>
                  </tr>
                </thead>
                <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                  {cartData.cartItems.map((item) => (
                    <tr key={item.product._id.toString()}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <Link 
                        href={`/products/${item.product._id.toString()}`}
                        className='text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400'
                      >
                        {item.product.name}
                      </Link>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100'>
                      {item.qty}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-100'>
                      {item.product.price.toFixed(2)} €
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-gray-100'>
                      {(item.product.price * item.qty).toFixed(2)} €
                    </td>
                  </tr>
                  ))} 
                  <tr className='bg-gray-50 dark:bg-gray-900'>
                  <td colSpan={3} className='px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-gray-100'>
                    Total
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900 dark:text-gray-100'>
                    {totalPrice.toFixed(2)} €
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            {/*Checkout form*/}
            <form className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6'>
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
                    type='text'
                    id='shippingAddress'
                    name='address'
                    required
                    placeholder='Enter your shipping address'
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
                    required
                    placeholder='Foo Bar'
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
                      placeholder='0000111122223333'
                      className='w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                    />
                  </div>
                </div>
                
                {/* Submit button */}
                <div className='flex justify-center pt-4'>
                  <button type='submit' className='rounded-md bg-gray-900 dark:bg-gray-700 px-8 py-3 text-sm font-semibold text-white hover:bg-gray-800 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'>
                    Purchase
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}