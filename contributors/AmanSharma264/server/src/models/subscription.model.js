import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    billingCycle: {
        type: String,
        enum: ["monthly", "yearly"],
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    renewalDate: {
      type: Date,
      required: true,
    },
    isTrial: {
      type: Boolean,
      default: false,
    },
    trialEndDate: {
      type: Date,
    },
    source: {
      type: String,
      enum: ["manual", "gmail"],
      default: "manual",
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
},{
    timestamps: true,
}
)

export default mongoose.model("Subscription", subscriptionSchema);