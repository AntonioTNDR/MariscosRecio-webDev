import { User } from "@/models/User";
import { Types } from "mongoose";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrder, getUser, GetUserResponse } from "@/lib/handlers";
import { getSession } from "@/lib/auth";

interface ProfilePageProps {
  user: User & { _id: Types.ObjectId };
}

export default async function profile({
  params,
}: {
  params: { userId: string }
}) {
  const session = await getSession()
  const orders = await getOrder(params.userId)
    if (!session) {
      redirect('/auth/signin')
    }
  
    const userData = await getUser(session.userId) as GetUserResponse | null
    if (!userData) {
      redirect('/auth/signin')
    }

    return (
      <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-white-900 sm:pb-6 lg:pb-8'>
        User Profile
      </h3>
      <p>Name: {userData.name} {userData.surname}</p>
      <p>Email: {userData.email}</p>
      <p>Address: {userData.address}</p>
      <h4 className='pt-6 pb-4 text-2xl font-bold text-white-900 sm:pb-6 lg:pb-8'>
        Orders
      </h4>
      {orders?.cartItems.length === 0 ? ( // Show message if no orders
        <div className='text-center'>
          <span className='text-sm text-gray-400'>No orders found</span>
        </div>
      ) : ( //we just want the orderID and the address
        <> 
          <p>Order ID: {orders?._id.toString()}</p>
          <p>Address: {orders?.address}</p>
        </>
      )}
    </div>
    )
}