import { Types } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { ErrorResponse, getCart, getProducts, getUser, GetUserResponse } from '@/lib/handlers'
import { getSession } from '@/lib/auth'

//Defined in anex A: Retrieve the list of cart items for an existing user

//This endpoint needs authentication and authorization

export async function GET(
  request: NextRequest, //Request object
  {
    params, //Paramseters that are passed in the URL
  }: { 
    params: { userId: string } //Parameters type
  }
): Promise<NextResponse<GetUserResponse> | NextResponse<ErrorResponse>> { //Define return type, in this case either user or error response

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

  //Check for an invalid ID
  if(!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json( //Return 400 if not
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID.',
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

  //Fetch user from database
  const user = await getCart(params.userId);
  //If the user does not exist, return 404
  if (user === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found.',
      },
      { status: 404 }
    )
  } 
  return NextResponse.json(user);
}