import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Users, {User} from '@/models/User';
import Products, {Product} from '@/models/Product';

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

const products: Product[] = [
  {
    name: 'Earthen Bottle',
    description: 'What a bottle!',
    price: 39.95,
    image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
  },
  {
    name: 'Nomad Tumbler',
    description: 'Yet another item',
    price: 39.95,
    image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
  },
];


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

const insertedProducts = await Products.insertMany(products);


const user: User = {
  email: 'johndoe@example.com',
  password: '1234',
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
  orders: [],
};


const res = await Users.create(user);
console.log(JSON.stringify(res, null, 2));

const userProjection = {
name: true,
surname: true,
};
const productProjection = {
name: true,
price: true,
};
const retrievedUser = await Users
.findOne({ email: 'johndoe@example.com' }, userProjection)
.populate('cartItems.product', productProjection);
console.log(JSON.stringify(retrievedUser, null, 2));

await conn.disconnect();
}
seed().catch(console.error);