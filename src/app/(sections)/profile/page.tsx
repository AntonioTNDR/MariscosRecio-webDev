import { User } from "@/models/User";
import { Types } from "mongoose";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrder, getUser, GetUserResponse } from "@/lib/handlers";
import { getSession } from "@/lib/auth";
import { Order } from "@/models/Order";

interface ProfilePageProps {
  user: User & { _id: Types.ObjectId };
}

interface PopulatedOrdersResponse {
  orders: (Order & { _id: Types.ObjectId })[];
}

export default async function profile({
  params,
}: {
  params: { userId: string }
}) {
    const session = await getSession()
    if (!session) {
      redirect('/auth/signin')
    }
    
    const orders = await getOrder(session.userId) as PopulatedOrdersResponse | null

    const userData = await getUser(session.userId) as GetUserResponse | null
    if (!userData) {
      redirect('/auth/signin')
    }

    return (
      <div className='flex flex-col space-y-8 max-w-6xl mx-auto'>
    
        {/* Cool looking box with user information */}
        <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
          <h3 className='pb-4 text-3xl font-bold text-white-900 sm:pb-6 lg:pb-8'>
            User Profile
          </h3>

          { /* User Information Section */ }
          <div className='space-y-3'>

            {/* Each row contains a label and the corresponding user data */ }
            <div className='flex items-start'>
              <span className='text-gray-600 dark:text-gray-400 w-32 flex-shrink-0'>
                Full Name:
              </span>

              <span className='text-gray-900 dark:text-gray-100 font-medium'>
                {userData.name} {userData.surname}
              </span>
            </div>

            <div className='flex items-start'>
              <span className='text-gray-600 dark:text-gray-400 w-32 flex-shrink-0'>
                Email:
              </span>

              <span className='text-gray-900 dark:text-gray-100 font-medium'>
                {userData.email}
              </span>
            </div>

            <div className='flex items-start'>
              <span className='text-gray-600 dark:text-gray-400 w-32 flex-shrink-0'>
                Address:
              </span>

              <span className='text-gray-900 dark:text-gray-100 font-medium'>
                {userData.address}
              </span>
            </div>

            <div className='flex items-start'>
              <span className='text-gray-600 dark:text-gray-400 w-32 flex-shrink-0'>
                Birthdate:
              </span>

              <span className='text-gray-900 dark:text-gray-100 font-medium'>
                {userData.birthdate.toDateString()}
              </span>
            </div>

          </div>
        </div>

      
        <h4 className='pt-6 pb-4 text-2xl font-bold text-white-900 sm:pb-6 lg:pb-8'>
          Orders
        </h4>
        {orders === null ? ( // Show message if no orders
        <div className='text-center'>
          <span className='text-sm text-gray-400'>No orders found</span>
        </div>
      ) : ( //we just want the orderID and the address AND since orders is an array we need to map through it
        <> 
          <div className='bg-white dark:gb-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
            {/* Table Header */}
            <div className='grid grid-cols-3 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
              <div className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Order ID
              </div>
              <div className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Shipment Address
              </div>
              <div className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Payment Information
              </div>
            </div>

            {/* Orders List */}
            
          </div>  
        </>
      )}
      </div>
    )
}