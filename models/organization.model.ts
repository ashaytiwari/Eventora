import mongoose, { Model, Schema } from "mongoose";

export interface IOrganization extends Document {
  organizationName: string;
  userId: mongoose.Types.ObjectId;
  about?: string;
  website?: string;
  tagLine?: string;
  address?: string;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    organizationName: {
      type: String,
      required: [true, 'Organization Name is required'],
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    about: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    tagLine: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true
  }
);

// Prevent OverwriteModelError in Next.js development server during hot reloading
const Organization: Model<IOrganization> = mongoose.models.Organization || mongoose.model<IOrganization>('Organization', OrganizationSchema);

export default Organization;