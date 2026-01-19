const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Subscription {
  _id: string;
  userId: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'custom';
  category: 'entertainment' | 'music' | 'education' | 'productivity' | 'finance' | 'health' | 'other';
  renewalDate: string;
  isTrial: boolean;
  trialEndsAt?: string;
  source: 'manual' | 'gmail' | 'imported';
  status: 'active' | 'paused' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionResponse {
  subscriptions: Subscription[];
}

export async function getSubscriptions(token: string): Promise<SubscriptionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/subscriptions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch subscriptions');
  }

  return response.json();
}

export async function createSubscription(
  token: string,
  data: Omit<Subscription, '_id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<{ message: string; subscription: Subscription }> {
  const response = await fetch(`${API_BASE_URL}/api/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create subscription');
  }

  return response.json();
}

export async function updateSubscription(
  token: string,
  id: string,
  data: Partial<Omit<Subscription, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<{ message: string; subscription: Subscription }> {
  const response = await fetch(`${API_BASE_URL}/api/subscriptions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update subscription');
  }

  return response.json();
}

export async function deleteSubscription(
  token: string,
  id: string
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/subscriptions/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete subscription');
  }

  return response.json();
}
