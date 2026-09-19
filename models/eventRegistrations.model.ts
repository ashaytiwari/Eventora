import mongoose, { Model, Schema } from "mongoose";

import { Gender } from "@/lib/constants/gender";

export interface IEventRegistrations extends Document {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  registeredAt: Date;

  attendeeDetails: Array<{
    fullName: string,
    age: number,
    gender: Gender
  }>;

  createdAt: Date;
  updatedAt: Date;
};

const EventRegistrationsSchema = new Schema<IEventRegistrations>({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  attendeeDetails: [
    {
      fullName: {
        type: String,
        required: [true, 'Full name is required'],
      },
      age: {
        type: Number,
        required: [true, 'Age is required'],
      },
      gender: {
        type: String,
        enum: Object.values(Gender),
        required: [true, 'Gender is required'],
      },
    },
  ],
}, {
  timestamps: true,
});

const EventRegistrations: Model<IEventRegistrations> = mongoose.models.EventRegistrations || mongoose.model<IEventRegistrations>('EventRegistrations', EventRegistrationsSchema);

export default EventRegistrations;