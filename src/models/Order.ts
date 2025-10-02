import mongoose, {Double, Schema, Types} from "mongoose";

export interface Order {
  date: Date;
  address: string;
  cardHolder: string;
  cardNumber: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  product: Types.ObjectId;
  qty: number;
  price: number;
}

const OrderSchema = new Schema<Order>({
  date: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  cardHolder: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  orderItems: [
    {
      _id: false,
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      qty: {
        type: Number,
        required: true,
    },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
});

export default mongoose.models.Order as mongoose.Model<Order> || mongoose.model<Order>('Order',OrderSchema);