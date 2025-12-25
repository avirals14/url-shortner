import mongoose, { Schema } from "mongoose";

const urlSchema = new Schema(
  {
    originalUrl: {
      type: String,
      trim: true,
      required: true,
    },

    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    clicks: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Url", urlSchema);