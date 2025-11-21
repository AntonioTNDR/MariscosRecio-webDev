import dotenv from 'dotenv';
import mongoose, { now } from 'mongoose';
import Users, {User} from '@/models/User';
import Products, {Product} from '@/models/Product';
import Orders, {Order} from '@/models/Order';
import bcrypt from 'bcrypt';

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
if (!MONGODB_URI) {
throw new Error(
  'Please define the MONGODB_URI environment variable inside .env.local'
);
}
const opts = { bufferCommands: false };
const conn = await mongoose.connect(MONGODB_URI, opts);
if (conn.connection.db === undefined) {
throw new Error('Could not connect');
}

await conn.connection.db.dropDatabase();


// Do things here.


const products: Product[] = [
  {
    name: 'Earthen Bottle',
    description: 'What a bottle!',
    price: 39.95,
    image: 'https://e01-elmundo.uecdn.es/assets/multimedia/imagenes/2024/02/23/17087044090359.jpg',
  },
  {
    name: 'Nomad Tumbler',
    description: 'Yet another item',
    price: 39.95,
    image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
  },
];


const insertedProducts = await Products.insertMany(products);

const hashedPassword = await bcrypt.hash('1234', 10);

// Create an order first
const order: Order = {
  date: new Date(),
  address: '123 Main St, 12345 New York, United States',
  cardHolder: 'John Doe',
  cardNumber: '1234567812345678',
  orderItems: [
    {
      product: insertedProducts[0]._id,
      qty: 2,
      price: insertedProducts[0].price * 2,
    },
    {
      product: insertedProducts[1]._id,
      qty: 5,
      price: insertedProducts[1].price * 5,
    },
  ],
};

const createdOrder = await Orders.create(order);
console.log('Created order:', JSON.stringify(createdOrder, null, 2));

// Now create user with the order reference
const user: User = {
  email: 'johndoe@example.com',
  password: hashedPassword,
  name: 'John',
  surname: 'Doe',
  address: '123 Main St, 12345 New York, United States',
  birthdate: new Date('1970-01-01'),
  cartItems: [
    {
      product: insertedProducts[0]._id,
      qty: 2,
    },
    {
      product: insertedProducts[1]._id,
      qty: 5,
    },
  ],
  orders: [createdOrder._id], // Add the order ID here
};

const res = await Users.create(user);
console.log('Created user:', JSON.stringify(res, null, 2));

const userProjection = {
  name: true,
  surname: true,
  email: true,
  orders: true,
};
const productProjection = {
  name: true,
  price: true,
};

const retrievedUser = await Users
  .findOne({ email: 'johndoe@example.com' }, userProjection)
  .populate('cartItems.product', productProjection)
  .populate('orders');
console.log('Retrieved user with orders:', JSON.stringify(retrievedUser, null, 2));

await conn.disconnect();
}
seed().catch(console.error);