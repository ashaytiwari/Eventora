import mongoose, { Model, Schema } from "mongoose";

export interface IOrganizer extends Document {
  organizationName: string;
  userId: mongoose.Types.ObjectId;
  about?: string;
  website?: string;
  tagLine?: string;
  address?: string;
}

const OrganizerSchema = new Schema<IOrganizer>(
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
const Organizer: Model<IOrganizer> = mongoose.models.Organizer || mongoose.model<IOrganizer>('Organizer', OrganizerSchema);

export default Organizer;