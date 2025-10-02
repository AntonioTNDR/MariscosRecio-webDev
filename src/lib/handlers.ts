import Products, { Product } from '@/models/Product';
import connect from '@/lib/mongoose';
import { Types } from 'mongoose';
import Users, { User, CartItem } from '@/models/User';

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