import { Types } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { ErrorResponse, getUser, GetUserResponse, GetSingleOrderResponse, CreateOrderResponse, getSingleOrder, createOrder, getOrder } from '@/lib/handlers'

//create a get and a put method here

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string, orderId: string } }
): Promise<NextResponse<GetUserResponse> | NextResponse<ErrorResponse>> {
  if(!Types.ObjectId.isValid(params.userId) || !Types.ObjectId.isValid(params.orderId)) { //Check if userId is a valid ObjectId
    return NextResponse.json( //Return 400 if not
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID or order ID.',
      },
      { status: 400 }
    )
  }

  const order = await getOrder(params.userId);
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

