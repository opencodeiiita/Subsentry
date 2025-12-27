import mongoose from "mongoose"

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        name:{
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: [
                "Entertainment",
                "Music",
                "Education",
                "Productivity",
                "Finance",
                "Health",
                "Other",
            ],
            default: "Other",
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: "INR",
        },
        billingCycle: {
            type: String,
            enum: ["monthly", "yearly"],
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        renewalDate: {
            type: DataTransfer,
            required: true,
        },
        isTrial: {
            type: Boolean,
            default: false,
        },
        trialEndDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },

    source: {
      type: String,
      enum: ["manual", "gmail"],
      default: "manual",
    },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Subscription", subscriptionSchema);