import Products, { Product } from '@/models/Product';
import connect from '@/lib/mongoose';
import { Types } from 'mongoose';
import Users, { User, CartItem } from '@/models/User';
import Order from '@/models/Order';

//Error response interface
export interface ErrorResponse {
  error: string
  message: string
}

//Create user response interface
export interface CreateUserResponse {
  _id: Types.ObjectId
}

//Create user function
export async function createUser(user: { 
  email: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  birthdate: Date;
}): Promise<CreateUserResponse | null> { //Return null if user with the same email already exists
  
  await connect();

  //Check if user with the same email already exists
  const prevUser = await Users.find({ email: user.email });

  if (prevUser.length !== 0) {
    return null;
  }

  //Create user document
  const doc: User = {
    ...user, //Spread user object
    birthdate: new Date(user.birthdate),
    cartItems: [],
    orders: [],
  };

  //Create user in database
  const newUser = await Users.create(doc);

  //Return new user's id
  return {
    _id: newUser._id,
  };
}

//Get products response interface
export interface GetProductsResponse {
  products: (Product & { _id: Types.ObjectId })[]
}

//Get products function
export async function getProducts(): Promise<GetProductsResponse> {
  await connect() //Connect to database

  //Get products from database

  const productsProjection = {
    __v: false
  }
  const products = await Products.find({}, productsProjection)

  //Return products
  return {
    products,
  }
}

//Get user response interface
export interface GetUserResponse
  extends Pick<User, 'email' | 'name' | 'surname' | 'address' | 'birthdate'> {
  _id: Types.ObjectId
}

//Get user function
export async function getUser(
  userId: Types.ObjectId | string
): Promise<GetUserResponse | null> { //Return null if user not found
  await connect()

  //Get user from database
  const userProjection = {
    email: true,
    name: true,
    surname: true,
    address: true,
    birthdate: true,
  }
  //Query user by id
  const user = await Users.findById(userId, userProjection)

  return user
}

//Get cart items response interface
export interface GetCartItemsResponse extends Pick<Product, 'name' | 'price' | 'image'> {
  _id: Types.ObjectId
}

//Get cart items function
export async function getCart(
  userId: Types.ObjectId | string
): Promise<GetUserResponse | null> { //Return null if user not found
  await connect()

  //Get user from database
  const userProjection = {
    cartItems: true,
    _id: false
  }
  //Query user by id
  //This is basically like a join in SQL
  const cart = await Users.findById(userId, userProjection).populate('cartItems.product');

   

  return cart
}

//PUT cart function

//Response interface for cart 
export interface CartProductResponse {
  _id: Types.ObjectId
  name: string
  price: number
  img: string //mapped from Product.image
  description: string
}

export interface CartItemsRespone {
  product: CartProductResponse
  qty: number
}

export interface ModifyCartResponse {
  cartItems: CartItemsRespone[]
  isNewItem: boolean
}

//Update or insert a cart item quantity, and return only the cart
export async function putQty(
  userId: Types.ObjectId | string,
  productId: Types.ObjectId | string,
  qty: number
): Promise<GetUserResponse | null> { //Return null if user not found
  await connect()

  //for later use to return
  const userProjection = {
    cartItems: true,
    _id: false
  }
  
  const user = await Users.findById(userId, userProjection);

  const product = await Products.findById(productId);

  // const [user, product] = await Promise.all([
  //   Users.findById(userId),
  //   Products.findById(productId)
  // ]);

  if(!user) return null;
  if(!product) throw new Error('Product not found');

  const cartObject = user.cartItems.find(item => item.product._id === product._id);
  let isNewItem = false;

  if (!cartObject) {
    //If not, add it to cart
    user.cartItems.push({ product: product._id, qty });
    isNewItem = true;
  } else {
    //If it is, update quantity
    //qty must be > 0
    cartObject.qty = qty;
  }

  await user.save();

  //Re-fetch cart with populated products
  const refreshed = await Users.findById(userId, { cartItems: 1, _id: 0 }).populate({
    path: 'cartItems.product',
    select: 'name price image description'
  })

  if(!refreshed) return null;

  
  //esto es lo raro
  //Map cart items to response format



  //this is broken (tnks copilot)
  // const cartItems: CartItemsRespone[] = items.map((ci) => {
  //   const p = ci.product as unknown as PopulatedProduct;
  //   return {
  //     product: {
  //       _id: p._id,
  //       name: p.name,
  //       price: p.price,
  //       img: p.image,
  //       description: p.description
  //     },
  //     qty: ci.qty
  //   }
  // })
  // return { cartItems, isNewItem }

  return refreshed;
}