import mongoose, { Schema, Document, Model } from 'mongoose';

import { UserRole } from '@/lib/constants/userRoles';
import { UserStatus } from '@/lib/constants/userStatus';
import { AuthProvider } from '@/lib/constants/authProvider';

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  emailVerified: boolean;
  role: UserRole;
  createdBy?: mongoose.Types.ObjectId | null;
  providers: string[];
  googleId: string;
  status: UserStatus;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstname: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Exclude password from queries by default for security
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.EVENT_ATTENDEE,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    providers: {
      type: [String],
      enum: Object.keys(AuthProvider),
      default: [AuthProvider.CREDENTIALS],
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true
  }
);

// Prevent OverwriteModelError in Next.js development server during hot reloading
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
