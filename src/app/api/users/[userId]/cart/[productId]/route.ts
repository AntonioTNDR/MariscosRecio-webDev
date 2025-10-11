import { putQty } from '@/lib/handlers'


export async function PUT(
  req: Request, //Request object
  { params }: { params: { userId: string; productId: string } }
) {

  const { userId, productId } = params;

  //Parse JSON body safely
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  //Extract quantity and validate it
  const qty = Number ((body as { qty?: unknown })?.qty);
  if(!Number.isInteger(qty) || qty <= 0) {
    return new Response('Quantity must be an integer greater than 0', { status: 400 });
  }

  try{
    const result = await putQty(userId, productId, qty);

    if(!result) {
      return new Response('User not found', { status: 404 });
    }

    const payload = JSON.stringify({ cartItems: result});

    //201 when a new item is added
    if('isNewItem' in result && result.isNewItem) {
      return new Response(payload, {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    //200 when an existing item is updated
    return new Response(payload, {
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
      return new Response(msg, { status: 400 });
    }

    //Map not found errors to 404
    if(msg === 'User not found' || msg === 'Product not found') {
      return new Response(msg, { status: 404 });
    }

    //Everything else is a 500 error
    console.error('PUT /api/users/[userId]/cart/[productId] error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}