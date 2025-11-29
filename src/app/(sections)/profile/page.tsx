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
      <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-white-900 sm:pb-6 lg:pb-8'>
        User Profile
      </h3>
      <p className='font semi-bold'>Name: {userData.name} {userData.surname}</p>
      <p>Email: {userData.email}</p>
      <p>Address: {userData.address}</p>
      <h4 className='pt-6 pb-4 text-2xl font-bold text-white-900 sm:pb-6 lg:pb-8'>
        Orders
      </h4>
      {orders === null ? ( // Show message if no orders
        <div className='text-center'>
          <span className='text-sm text-gray-400'>No orders found</span>
        </div>
      ) : ( //we just want the orderID and the address AND since orders is an array we need to map through it
        <> 
          
        </>
      )}
    </div>
    )
}