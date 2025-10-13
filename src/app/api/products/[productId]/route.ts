import { ErrorResponse, getProducts, GetProductsResponse, deleteFromCart } from '@/lib/handlers'
import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'

//Defined in anex A: Retrieve the details of a product by its ID
export async function GET(
  request: NextRequest, //Request object
  {
    params, //Paramseters that are passed in the URL
  }: { 
    params: { productId: string } //Parameters type
  }
): Promise<NextResponse<GetProductsResponse> | NextResponse<ErrorResponse>> { //Define return type, in this case either product or error response
  //Check for an invalid ID
  if(!Types.ObjectId.isValid(params.productId)) {
    return NextResponse.json( //Return 400 if not
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid product ID.',
      },
      { status: 400 }
    )
  }

  //Fetch product from database
  const product = await getProducts();


  //If the product does not exist, return 404
  if (product === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'Product not found.',
      },
      { status: 404 }
    )
  }

  return NextResponse.json(product);
}