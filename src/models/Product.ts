import mongoose, {Double, Schema, Types} from "mongoose";

export interface Product {
  name: string;
  description: string;
  image: string;
  price: number;
  // CartItems: CartItem[];
  // OrderItems: OrderItem[];
}

// export interface CartItem {
//   product: Types.ObjectId;
//   qty: number;
// }

// export interface OrderItem {
//   product: Types.ObjectId;
//   qty: number;
//   price: Double;
// }

const ProductSchema = new Schema<Product>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }
});

export default mongoose.models.Product as mongoose.Model<Product> || mongoose.model<Product>('Product',ProductSchema);