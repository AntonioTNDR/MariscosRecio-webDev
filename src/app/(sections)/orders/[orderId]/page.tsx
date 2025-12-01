import { User } from "@/models/User";
import { Types } from "mongoose";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOrder, getSingleOrder, GetSingleOrderResponse, getUser, GetUserResponse } from "@/lib/handlers";
import { getSession } from "@/lib/auth";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

interface PopulatedOrderItem {
  product: Product & { _id: Types.ObjectId };
  qty: number;
  price: number;
}

// Define populated order response
interface PopulatedOrder extends Omit<GetSingleOrderResponse, 'orderItems'> {
  orderItems: PopulatedOrderItem[];
}

export default async function orderPage({
  params,
}: {
  params: { orderId: string }
}) {
    const session = await getSession()
    if (!session) {
      redirect('/auth/signin')
    }
    
    //validate orderId
    if(!Types.ObjectId.isValid(params.orderId)){
      notFound();
    }

    const orderData = await getSingleOrder(session.userId, params.orderId) as PopulatedOrder | null

    if (!orderData) {
      notFound();
    }

    //Calculate total price
    const totalPrice = orderData.orderItems.reduce(
      (sum, item) => sum + item.price, 0
    );

    //Foramt date
    const formattedDate = new Date(orderData.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

    return (
      <div className='flex flex-col space-y-8 max-w-6xl mx-auto'>
    
        {/* Cool looking box with order information */}
        <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
          <h3 className='pb-4 text-3xl font-bold text-white-900 sm:pb-6 lg:pb-8'>
            Order Details
          </h3>

          { /* Order Information Section */ }
          <div className='space-y-3'>

            {/* Each row contains the order data */ }
            <div className='flex items-start'>
              <span className='text-gray-600 dark:text-gray-400 w-40 flex-shrink-0'>
                Order ID
              </span>

              <span className='text-gray-900 dark:text-gray-100 font-medium'>
                {params.orderId}
              </span>
            </div>

            <div className='flex items-start'>
              <span className='text-gray-600 dark:text-gray-400 w-40 flex-shrink-0'>
                Shipping Address:
              </span>

              <span className='text-gray-900 dark:text-gray-100 font-medium'>
                {orderData.address}
              </span>
            </div>

            <div className='flex items-start'>
              <span className='text-gray-600 dark:text-gray-400 w-40 flex-shrink-0'>
                Payment Information:
              </span>

              <span className='text-gray-900 dark:text-gray-100 font-medium'>
                <div>{orderData.cardHolder}</div>
                <div className='text-gray-600 dark:text-gray-300 font-mono text-sm'>
                  **** **** **** {orderData.cardNumber.slice(-4)}
                </div>
              </span>
            </div>

            <div className='flex items-start'>
              <span className='text-gray-600 dark:text-gray-400 w-40 flex-shrink-0'>
                Date of purchase:
              </span>

              <span className='text-gray-900 dark:text-gray-100 font-medium'>
                {formattedDate}
              </span>
            </div>

          </div>
        </div>
        {/* Order Items Section */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Order Items
          </h2>

          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Product Name
                  </th>
                  <th scope='col' className='px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Quantity
                  </th>
                  <th scope='col' className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Unit Price
                  </th>
                  <th scope='col' className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Total Price
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {orderData.orderItems.map((item) => (
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
                    {(item.price / item.qty).toFixed(2)} €
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-gray-100'>
                    {item.price.toFixed(2)} €
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

          <div className="flex justify-start">
            <Link
              href="/profile"
              className="inline-block px-6 py-3 bg-sky-600 text-white text-sm font-medium rounded-md hover:bg-sky-700 transition"
            >
              Back to User Profile
            </Link>
          </div>
        </div>
      </div>
    )
}