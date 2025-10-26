import { Types } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { ErrorResponse, getUser, GetUserResponse, GetSingleOrderResponse, CreateOrderResponse, getSingleOrder, createOrder } from '@/lib/handlers'
import { getSession } from '@/lib/auth'

//create a get and a put method here

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string, orderId: string } }
): Promise<NextResponse<GetSingleOrderResponse> | NextResponse<ErrorResponse>> {
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json(
      {
        error: 'NOT_AUTHENTICATED',
        message: 'Authentication required.',
      },
      { status: 401 }
    )
  }

  if(!Types.ObjectId.isValid(params.userId) || !Types.ObjectId.isValid(params.orderId)) { //Check if userId is a valid ObjectId
    return NextResponse.json( //Return 400 if not
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID or order ID.',
      },
      { status: 400 }
    )
  }

  if (session.userId.toString() !== params.userId) {
  return NextResponse.json(
      {
        error: 'NOT_AUTHORIZED',
        message: 'Unauthorized access.',
      },
      { status: 403 }
    )
  }

  const order = await getSingleOrder(params.userId, params.orderId);
  if (order === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found or order not found.',
      },
      { status: 404 }
    )
  }
  return NextResponse.json(order);
}

