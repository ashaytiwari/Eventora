import mongoose, { Model, Schema } from "mongoose";

import { EventStatus } from "@/lib/constants/eventStatus";

export interface IEvent extends Document {
  title: string;
  about: string;
  image?: string;

  artist?: {
    name: string;
    image?: string;
  };

  seoTags: string[];

  startAt: Date;
  endAt: Date;

  ageLimit?: number;
  language: string;

  isVirtualEvent: boolean;
  virtualEventLink?: string;

  eventLocation?: string;

  organizerId: mongoose.Types.ObjectId;

  status: EventStatus;

  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    about: {
      type: String,
      required: [true, 'About is required'],
      trim: true,
    },
    image: {
      type: String,
    },
    artist: {
      name: {
        type: String,
        trim: true,
      },
      image: {
        type: String,
      },
    },
    seoTags: [
      {
        type: String,
        trim: true,
      },
    ],
    startAt: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endAt: {
      type: Date,
      required: [true, 'End date is required'],
    },
    ageLimit: {
      type: Number,
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      trim: true,
    },
    isVirtualEvent: {
      type: Boolean,
      default: false,
    },
    virtualEventLink: {
      type: String,
      trim: true,
    },
    eventLocation: {
      type: String,
      trim: true,
    },
    organizerId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organizer ID is required'],
    },
    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.DRAFT,
    },
  },
  {
    timestamps: true
  }
);

// Prevent OverwriteModelError in Next.js development server during hot reloading
const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;