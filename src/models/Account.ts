import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPermissions {
  canDeposit: boolean;
  canWithdraw: boolean;
  canInvest: boolean;
  canBuySecurities: boolean;
}

export interface IAccount extends Document {
  _id: Types.ObjectId;
  name: string;
  avatarColor: string;
  shareToken?: string;
  permissions: IPermissions;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionsSchema = new Schema<IPermissions>(
  {
    canDeposit: { type: Boolean, default: false },
    canWithdraw: { type: Boolean, default: false },
    canInvest: { type: Boolean, default: false },
    canBuySecurities: { type: Boolean, default: false },
  },
  { _id: false }
);

const AccountSchema = new Schema<IAccount>(
  {
    name: { type: String, required: true },
    avatarColor: { type: String, required: true },
    shareToken: { type: String, unique: true, sparse: true },
    permissions: { type: PermissionsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const Account =
  mongoose.models.Account || mongoose.model<IAccount>("Account", AccountSchema);
