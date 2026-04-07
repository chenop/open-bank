import mongoose, { Schema, Document, Types } from "mongoose";

export interface IHolding extends Document {
  _id: Types.ObjectId;
  account: Types.ObjectId;
  symbol: string;
  name: string;
  quantity: number;
  costPerUnit: number;
  purchaseDate: Date;
  soldAt?: Date;
  soldPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

const HoldingSchema = new Schema<IHolding>(
  {
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true, index: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    costPerUnit: { type: Number, required: true },
    purchaseDate: { type: Date, required: true },
    soldAt: { type: Date },
    soldPrice: { type: Number },
  },
  { timestamps: true }
);

export const Holding =
  mongoose.models.Holding || mongoose.model<IHolding>("Holding", HoldingSchema);
