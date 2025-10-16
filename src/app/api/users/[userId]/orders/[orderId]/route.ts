import { Types } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { ErrorResponse, getUser, GetUserResponse, GetSingleOrderResponse, CreateOrderResponse, getSingleOrder, createOrder } from '@/lib/handlers'

//create a get and a put method here

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string, orderId: string } }
): Promise<NextResponse<GetSingleOrderResponse> | NextResponse<ErrorResponse>> {
  if(!Types.ObjectId.isValid(params.userId) || !Types.ObjectId.isValid(params.orderId)) { //Check if userId is a valid ObjectId
    return NextResponse.json( //Return 400 if not
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID or order ID.',
      },
      { status: 400 }
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

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<CreateOrderResponse> | NextResponse<ErrorResponse>>
{
  const body = await request.json()
  if (
    !body.address ||
    !body.cardHolder ||
    !body.cardNumber
  ) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Request parameters are wrong or missing.',
      },
      { status: 400 }
    )
  }

  if(!Types.ObjectId.isValid(params.userId)) { //Check if userId is a valid ObjectId
    return NextResponse.json( //Return 400 if not
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID.',
      },
      { status: 400 }
    )
  }

  const orderId = await createOrder(params.userId, body);
  if (orderId === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found or cart is empty.',
      },
      { status: 404 }
    )
  }

  return NextResponse.json(orderId, { status: 201 })

}