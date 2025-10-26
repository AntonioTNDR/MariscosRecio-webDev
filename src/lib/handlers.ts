import Products, { Product } from '@/models/Product';
import connect from '@/lib/mongoose';
import { Types } from 'mongoose';
import Users, { User, CartItem } from '@/models/User';
import Orders, {Order} from '@/models/Order';
import bcrypt from 'bcrypt';

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
  const hash = await bcrypt.hash(user.password, 10)
  const doc: User = {
    ...user,
    password: hash,
    birthdate: new Date(user.birthdate),
    cartItems: [],
    orders: [],
  }

  const newUser = await Users.create(doc)

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

export async function getProductById(
  productId: Types.ObjectId | string
): Promise<GetProductsResponse | null> { //Return null if product not found
  await connect()

  //Get product from database
  const product = await Products.findById(productId)

  if (!product) {
    return null
  }

  return {
    products: [product]
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

//PUT cart function (DO LATER)

//Response interface for cart products
export interface CartProductResponse {
  _id: Types.ObjectId
  name: string
  price: number
  img: string //mapped from Product.image
  description: string
}

//Response interface for cart items
export interface CartItemResponse {
  product: CartProductResponse
  qty: number
}

//Response interface for cart
export interface GetCartResponse {
  cartItems: CartItemResponse[]
  isNewItem: boolean // Internal flag to determine status code
}

//Update or insert a cart item quantity
export async function putQty(
  userId: Types.ObjectId | string,
  productId: Types.ObjectId | string,
  qty: number
): Promise<GetCartResponse | null> { //Return null if user not found
  await connect()

  // 1. Find user and product
  const user = await Users.findById(userId);
  const product = await Products.findById(productId);

  if (!user) return null;
  if (!product) throw new Error('Product not found');

  // 2. Check if product is already in cart
  const existingCartItem = user.cartItems.find(
    item => item.product.toString() === product._id.toString()
  );

  let isNewItem = false;

  if (existingCartItem) {
    // Update existing item quantity
    existingCartItem.qty = qty;
  } else {
    // Add new item to cart
    user.cartItems.push({ product: product._id, qty });
    isNewItem = true;
  }

  // 3. Save changes
  await user.save();

  // 4. Re-fetch cart with populated products (like a SQL JOIN)
  interface PopulatedProduct {
    _id: Types.ObjectId
    name: string
    price: number
    image: string
    description: string
  }

  interface PopulatedCartItem {
    product: PopulatedProduct
    qty: number
  }

  const refreshedUser = await Users.findById(userId, { cartItems: 1 }).populate({
    path: 'cartItems.product',
    select: 'name price image description'
  });

  if (!refreshedUser) return null;

  // 5. Map to response format (cast to populated type first)
  const populatedCart = refreshedUser.cartItems as unknown as PopulatedCartItem[];
  
  const cartItems: CartItemResponse[] = populatedCart.map(item => ({
    product: {
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      img: item.product.image, // Rename image -> img
      description: item.product.description
    },
    qty: item.qty
  }));

  return { cartItems, isNewItem };
}

//DELETE product from cart

export async function deleteFromCart(userId: Types.ObjectId | string, productId: Types.ObjectId | string): Promise<GetUserResponse | null> { //Return null if user and/or product not found
  await connect()

  const user = await Users.findById(userId)
  const product = await Products.findById(productId)
  
  if (!user) return null //If there is no user, we return null
  if (!product) return null //If there is no product, we return null

  //This is what actually removes the item from the cart
  //Convert both to strings for proper comparison
  //This is done because product is an ObjectId object, while productId is a string -> they need to be the same type to compare
  //AKA the bug is fixed
  user.cartItems = user.cartItems.filter(
    item => item.product.toString() !== productId.toString()
  )

  //Save changes to the DB
  await user.save()

  //Query the DB again to get the updated cart (join operation -> user U product = cart with product details)
  const userProjection = { //We only need to return cart items
    cartItems: true,
    _id: false
  }
  const cart = await Users.findById(userId, userProjection).populate('cartItems.product');

  //Return the updated cart
  return cart;
}



//Create Order response interface
export interface CreateOrderResponse {
  _id: Types.ObjectId
}

//ORDERS PART

//Create order function
export async function createOrder(userId: Types.ObjectId | string, order: { 
  date: Date;
  address: string;
  cardHolder: string;
  cardNumber: string;
}): Promise<CreateOrderResponse | null> { //Return null if user not found
  await connect();

  //Check if user exists
  const user = await Users.findById(userId);
  if (!user) return null;
  if(user.cartItems.length === 0){
    return null; //Cannot create order with empty cart
  }

  //Create order document
  

  //Get user from database
  const userProjection = {
    cartItems: true,
    _id: false
  }

  //We have to create some interfaces to make TypeScript happy
  interface PopulatedProduct{
    _id: Types.ObjectId
    name: string
    price: number
    image: string
    description: string
  }

  interface PopulatedCartItem {
    product: PopulatedProduct
    qty: number
  }

  //IMPORTANT
  //After populating, we will get an array of cart items with products
  //THEN we can use the PopulatedCartItem interface to see each product, as if we were seeing it in the cart page
  //Afterwards, since product is of type PopulatedProduct, we can access the details of each product in the cart
  interface PopulatedCart {
    cartItems: PopulatedCartItem[]
  }
  //Query user by id
  //This is basically like a join in SQL
  //We have to cast it to PopulatedCart so TS knows what we're doing
  const cart = await Users.findById(userId, userProjection).populate('cartItems.product') as PopulatedCart | null;

  //If the cart is empty, return null and do error handling in the route
  if(!cart) return null;

  const orderItems = cart.cartItems.map(item => ({
    product: item.product._id,   
    qty: item.qty,
    price: item.product.price * item.qty    //You see the three interfaces above? Yeah this is the reason why we created them
  }))

  //Create order document
  const orderDoc = {
    ...order,
    date: new Date(order.date),
    orderItems: orderItems,
  };

  //Create order in database
  const newOrder = await Orders.create(orderDoc);
  
  //Add order to user's orders array
  user.orders.push(newOrder._id);
  
  //Empty the cart after creating the order
  user.cartItems = [];
  
  //Save changes to the DB (both orders array and empty cart)
  await user.save();

  //Done!
  return {
    _id: newOrder._id
  };
}


interface GetOrderResponse extends Pick<Order, 'date' | 'address' | 'cardHolder' | 'orderItems'> {
  _id: Types.ObjectId
}

interface OrderItemResponse extends Pick<Order['orderItems'][0], 'qty' | 'price'> {
  product: CartProductResponse
}

//get orders function
export async function getOrder(userId: Types.ObjectId | string): Promise<GetUserResponse | null> { //Return null if user not found
  await connect() // we connect to the database
  
  const orderProjection = { //We only need to return orders
    orders: true,
    _id: false
  }

  const orders = await Users.findById(userId, orderProjection).populate('orders');
  if(!orders) return null;
  return orders
}

//Find an existing order of an existing user by ID.
export interface GetSingleOrderResponse extends Order {
  _id: Types.ObjectId
}

export async function getSingleOrder(
  userId: Types.ObjectId | string,
  orderId: Types.ObjectId | string
): Promise<GetSingleOrderResponse | null> { //Return null if user or order not found
  await connect() // we connect to the database

  //Validate Ids
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(orderId)) {
    throw new Error('Invalid user ID or order ID');
  }

  //Check if user exists
  const user = await Users.findById(userId);
  if (!user) return null;

  //Join and all of that (I'm very tired)
  const orderDoc = await Orders.findById(orderId).populate('orderItems.product');

  if (!orderDoc) return null;

  return orderDoc;
}

export interface CheckCredentialsResponse {
  _id: Types.ObjectId
}

//Check user credentials function
export async function checkCredentials(
  email: string,
  password: string
): Promise<CheckCredentialsResponse | null> { //Return null if credentials are invalid
  await connect();
  
  const normalizedEmail = email.toLowerCase().trim();
  const user = await Users.findOne({email: normalizedEmail});
  
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;

  return {
    _id: user._id
  };
}