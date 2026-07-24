import mongoose, { Schema, Document, Model } from 'mongoose';

import { VerificationTokenPurpose } from '@/lib/constants';

export interface IVerificationToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  purpose: string,
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    purpose: {
      type: String,
      enum: Object.values(VerificationTokenPurpose),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent OverwriteModelError in Next.js development server during hot reloading
const VerificationToken: Model<IVerificationToken> = mongoose.models.VerificationToken || mongoose.model<IVerificationToken>('VerificationToken', VerificationTokenSchema);

export default VerificationToken;
