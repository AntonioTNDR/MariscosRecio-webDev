import { Types } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { deleteFromCart, ErrorResponse, putQty, GetProductsResponse, CartItemResponse, getCart, GetUserResponse } from '@/lib/handlers'
import { getSession } from '@/lib/auth'

//this endpoint needs authentication and authorization
export async function PUT(
  req: Request, //Request object
  { params }: { params: { userId: string; productId: string } }
): Promise<NextResponse<{ cartItems: CartItemResponse[] } | ErrorResponse>> { //Define return type

  const session = await getSession()
  if (!session?.userId) {
  return NextResponse.json(
    {
      error: 'NOT_AUTHENTICATED',
      message: 'Authentication required.',
    },
    { status: 401 }
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
  try{
    const { userId, productId } = params;

    const body = await req.json();
    const qty = Number(body.qty);

    //Validate quantity
    if (!qty || qty <= 0) {
      return NextResponse.json(
        {
          error: 'Quantity must be greater than zero.',
          message: 'Quantity must be a positive number.',
        },
        { status: 400 }
      )
    }

    const result = await putQty(userId, productId, qty);

    //If null, user was not found
    if (!result) {
      return NextResponse.json(
        {
          error: 'NOT_FOUND',
          message: 'User not found.',
        },
        { status: 404 }
      )
    }

    // Determine status code: 201 for new item, 200 for update
    const statusCode = result.isNewItem ? 201 : 200;

    // Return cart items (without isNewItem flag in response)
    const response = { cartItems: result.cartItems };

    return NextResponse.json(response, { status: statusCode });
  }
  catch (error) {
    const message = (error as Error).message;

    if (message === "Invalid user ID or product ID") {
      return NextResponse.json(
        {
          error: 'WRONG_PARAMS',
          message: message,
        },
        { status: 400 }
      )
    }

    if (message === "Product not found") {
      return NextResponse.json(
        {
          error: 'NOT_FOUND',
          message: message,
        },
        { status: 404 }
      )
    }
  }

  //Generic server error
  return NextResponse.json(
    {
      error: 'SERVER_ERROR',
      message: 'An unexpected error occurred.',
    },
    { status: 500 }
  );
}

//this method also needs authentication and authorization 
//Defined in anex A: Remove a product from a user's cart
export async function DELETE(
  req: Request, //Request object
  { params }: { params: { userId: string; productId: string } }
): Promise<NextResponse<GetUserResponse> | NextResponse<ErrorResponse>> { //Define return type, in this case either user or error response
  const { userId, productId } = params;
  
  const session = await getSession()
  if (!session?.userId) {
  return NextResponse.json(
    {
      error: 'NOT_AUTHENTICATED',
      message: 'Authentication required.',
    },
    { status: 401 }
    )
  }

  //Validate IDs
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID.',
      },
      { status: 400 });
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

  if (!Types.ObjectId.isValid(params.productId)) {
    return NextResponse.json({
        error: 'WRONG_PARAMS',
        message: 'Invalid product ID.',
      },
      { status: 400 });
  }

  //Call deleteFromCart function
  const success = await deleteFromCart(params.userId, params.productId); //The return type of this is either null or the updated cart

  //If null, either user or product was not found

  if (success === null) {
    return NextResponse.json({
        error: 'NOT_FOUND',
        message: 'User not found or product not found.',
      },
      { status: 404 });
  }

  return NextResponse.json(success); //return the updated cart (the operation has been successful)
}