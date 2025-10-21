import { Types } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { ErrorResponse, getUser, GetUserResponse, GetSingleOrderResponse, CreateOrderResponse, getSingleOrder, createOrder, getOrder } from '@/lib/handlers'

//create a get and a put method here
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse<CreateOrderResponse> | NextResponse<ErrorResponse>>
{
  try {
    // Await params (Next.js App Router requirement)
    const { userId } = await params;

    // Validate user ID first
    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          error: 'WRONG_PARAMS',
          message: 'Invalid user ID.',
        },
        { status: 400 }
      )
    }

    // Parse request body
    const body = await request.json();
    
    // Log for debugging
    console.log('Received body:', body);

    // Validate required fields
    if (!body.address || !body.cardHolder || !body.cardNumber) {
      return NextResponse.json(
        {
          error: 'WRONG_PARAMS',
          message: 'Request parameters are wrong or missing.',
        },
        { status: 400 }
      )
    }

    // Create order data with current date
    const orderData = {
      date: new Date(),
      address: body.address,
      cardHolder: body.cardHolder,
      cardNumber: body.cardNumber,
    };

    // Create order
    const orderId = await createOrder(userId, orderData);
    
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

  } catch (error) {
    console.error('Error in POST /orders:', error);
    return NextResponse.json(
      {
        error: 'SERVER_ERROR',
        message: 'An unexpected error occurred.',
      },
      { status: 500 }
    )
  }
}


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

