import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVerificationToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: string;
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
      type: String,
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
