import mongoose, { Schema, Document, Types } from "mongoose";

export const TRANSACTION_TYPES = [
  "deposit",
  "withdraw",
  "invest",
  "uninvest",
  "buy_security",
  "sell_security",
  "interest",
] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export interface ITransaction extends Document {
  _id: Types.ObjectId;
  account: Types.ObjectId;
  type: TransactionType;
  amount: number;
  description?: string;
  relatedInvestment?: Types.ObjectId;
  relatedHolding?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true, index: true },
    type: { type: String, enum: TRANSACTION_TYPES, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    relatedInvestment: { type: Schema.Types.ObjectId, ref: "Investment" },
    relatedHolding: { type: Schema.Types.ObjectId, ref: "Holding" },
  },
  { timestamps: true }
);

export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
