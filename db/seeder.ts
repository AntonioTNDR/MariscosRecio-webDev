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
    name: 'Lobster',
    description: 'Raw lobster, frozen to preserve its freshness and flavour. Ideal for preparing sophisticated dishes such as paellas or stews, its firm and tasty meat is perfect for a special meal. Ready to cook and enjoy the taste of the sea.',
    price: 12.99,
    image: 'https://lasirena.vtexassets.com/arquivos/ids/371751-800-800?v=638626928181430000&width=800&height=800&aspect=true',
  },
  {
    name: 'Mussles',
    description: 'Galician mussels in their own juice, frozen to preserve their freshness, are a true delicacy from the sea. Organically farmed, these mussels are perfect to enjoy on their own or in traditional recipes. Add a touch of quality and flavour to your dishes with this sustainable option!',
    price: 4.99,
    image: 'https://lasirena.vtexassets.com/arquivos/ids/371755-800-800?v=638626935382870000&width=800&height=800&aspect=true',
  },
  {
    name: 'Prawns',
    description: 'Salted prawns, carefully prepared to offer an authentic sea flavour and tender texture. Frozen to preserve their freshness, they are perfect for use in a variety of recipes, from tapas to main courses. A delicious and versatile option for seafood lovers!',
    price: 6.99,
    image: 'https://lasirena.vtexassets.com/arquivos/ids/371741-800-800?v=638786637727430000&width=800&height=800&aspect=true'
  },
  {
    name: 'Razor clamb (500 grams)',
    description: "Recio's Seafood frozen razor clams are ideal for preparing seafood dishes with an authentic and delicate flavour. Frozen to preserve their freshness and texture, they are perfect for traditional or gourmet recipes. Shop at Recio's Seafood and enjoy high-quality razor clams that will add a special touch to your meals.",
    price: 4.99,
    image: 'https://lasirena.vtexassets.com/arquivos/ids/373615-800-800?v=638702188442730000&width=800&height=800&aspect=true',
  },
  {
    name: 'Premium Sea Bass (180g pack)',
    description: 'High-quality frozen sea bass fillets, guaranteed freshness. Ideal for preparing healthy and delicious recipes. Perfect for keeping your meals balanced and full of flavour. Buy now at Recio\'s Seafood and enjoy premium fish at the best price. The perfect choice for your kitchen!',
    price: 5.99,
    image: '/img/lubina.webp',
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