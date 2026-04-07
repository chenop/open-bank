import mongoose, { Schema, Document, Types } from "mongoose";

export interface IInvestment extends Document {
  _id: Types.ObjectId;
  account: Types.ObjectId;
  principalAmount: number;
  annualRate: number;
  startDate: Date;
  redeemedAt?: Date;
  redeemedAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const InvestmentSchema = new Schema<IInvestment>(
  {
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true, index: true },
    principalAmount: { type: Number, required: true },
    annualRate: { type: Number, default: 0.05 },
    startDate: { type: Date, required: true },
    redeemedAt: { type: Date },
    redeemedAmount: { type: Number },
  },
  { timestamps: true }
);

export const Investment =
  mongoose.models.Investment ||
  mongoose.model<IInvestment>("Investment", InvestmentSchema);
