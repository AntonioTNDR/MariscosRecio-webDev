import { Types } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { deleteFromCart, ErrorResponse, putQty, GetProductsResponse, getCart, GetUserResponse } from '@/lib/handlers'
import next from 'next';


export async function PUT(
  req: Request, //Request object
  { params }: { params: { userId: string; productId: string } }
): Promise<NextResponse<{ cartItems: GetProductsResponse | { isNewItem: boolean } } | ErrorResponse>> { //Define return type, in this case either user or error response

  const { userId, productId } = params;

  //Parse JSON body safely
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  //Extract quantity and validate it
  const qty = Number ((body as { qty?: unknown })?.qty);
  if(!Number.isInteger(qty) || qty <= 0) {
    return new NextResponse('Quantity must be an integer greater than 0', { status: 400 });
  }

  try{
    const result = await putQty(userId, productId, qty);

    if(!result) {
      return new NextResponse('User not found', { status: 404 });
    }

    const payload = JSON.stringify({ cartItems: result});

    //201 when a new item is added
    if('isNewItem' in result && result.isNewItem) {
      return new NextResponse(payload, {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    //200 when an existing item is updated
    return new NextResponse(payload, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch(err: unknown) {
    const msg = String((err as Error)?.message || 'Internal Server Error');

    //Map validation errors to 400
    if(
      msg === 'Invalid user ID' ||
      msg === 'Invalid product ID' ||
      msg === 'Quantity must be greater than 0'
    ) {
      return new NextResponse(msg, { status: 400 });
    }

    //Map not found errors to 404
    if(msg === 'User not found' || msg === 'Product not found') {
      return new NextResponse(msg, { status: 404 });
    }

    //Everything else is a 500 error
    console.error('PUT /api/users/[userId]/cart/[productId] error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

//Defined in anex A: Remove a product from a user's cart
export async function DELETE(
  req: Request, //Request object
  { params }: { params: { userId: string; productId: string } }
): Promise<NextResponse<GetUserResponse> | NextResponse<ErrorResponse>> { //Define return type, in this case either user or error response
  const { userId, productId } = params;


  //Validate IDs
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID.',
      },
      { status: 400 });
  }

  if (!Types.ObjectId.isValid(params.productId)) {
    return NextResponse.json({
        error: 'WRONG_PARAMS',
        message: 'Invalid product ID.',
      },
      { status: 400 });
  }

  //Call deleteFromCart function
  const success = await deleteFromCart(params.userId, params.productId);

  if (!success) {
    return NextResponse.json({
        error: 'NOT_FOUND',
        message: 'User not found or product not found.',
      },
      { status: 404 });
  }

  return NextResponse.json(success);
}