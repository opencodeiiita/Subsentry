-- Subscription Table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,

    plan_name VARCHAR(100) NOT NULL,
    source VARCHAR(50), -- stripe, razorpay, manual

    billing_cycle VARCHAR(20) NOT NULL, -- monthly, yearly
    status VARCHAR(20) NOT NULL, -- active, cancelled, expired

    is_trial BOOLEAN DEFAULT false,
    trial_end_date TIMESTAMP,

    start_date TIMESTAMP NOT NULL,
    renewal_date TIMESTAMP,
    end_date TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
