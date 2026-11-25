import mongoose from "mongoose";
import {
  DELIVERY_STATUS,
  DELIVERY_PRIORITY,
  DOCUMENT_TYPES,
} from "../constants/index.js";

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "El pedido es obligatorio"],
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(DELIVERY_STATUS),
      default: DELIVERY_STATUS.PENDING,
    },
    priority: {
      type: String,
      enum: Object.values(DELIVERY_PRIORITY),
      default: DELIVERY_PRIORITY.NORMAL,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    receipts: {
      type: [
        {
          originalName: {
            type: String,
            required: true,
          },
          fileName: {
            type: String,
            required: true,
          },
          path: {
            type: String,
            required: true,
          },
          mimeType: {
            type: String,
            required: true,
          },
          size: {
            type: Number,
            required: true,
          },
          documentType: {
            type: String,
            required: true,
            enum: [DOCUMENT_TYPES.DELIVERY_PROOF],
          },
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
