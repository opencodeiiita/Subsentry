import mongoose from "mongoose";


const subscriptionSchema = new mongoose.Schema({
    userId: {
        email:String,//might change to user schema reference 
        required: true
    },
    source: {
      type: String,
      enum: ["stripe", "paypal", "app_store", "play_store", "manual", "other"],
      required: true
    },
    billingPlan: {
        cycle:{

            type: String,
            enum: ["monthly", "yearly", "weekly"],
            required: true
        },
         amount: {
        type: Number,
        required: true,
        min: 0
      },
        currency: {
            type: String,
            required: true
        }
    },
    renewalDate: {
        type: Date,
        required: true
    },
    
    status: {
      type: String,
      enum: ["active", "trialing", "paused", "cancelled", "expired"],
      required: true,
      default: "active"
    },

    trial: {
      isTrial: {
        type: Boolean,
        default: false
      },
      trialEndsAt: {
        type: Date,
        default: null
      }
    },
     renewal: {
      autoRenew: {
        type: Boolean,
        default: true
      },
      nextRenewalAt: {
        type: Date,
        default: null
      }
    },

    startedAt: {
      type: Date,
      required: true
    },

    endsAt: {
      type: Date,
      default: null
    }
}, {
    timestamps: true
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);