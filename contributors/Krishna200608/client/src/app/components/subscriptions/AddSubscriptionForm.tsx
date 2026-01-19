'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  CreditCard,
  Calendar,
  DollarSign,
  Tag,
  Clock,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Plus,
  Zap,
} from 'lucide-react';
import { createSubscription } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getServiceIcon, getServiceColors } from '@/lib/service-icons';

// Form field types
interface FormData {
  name: string;
  amount: string;
  currency: string;
  billingCycle: string;
  category: string;
  renewalDate: Date | undefined;
  isTrial: boolean;
  trialEndsAt: Date | undefined;
  source: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  amount?: string;
  billingCycle?: string;
  category?: string;
  renewalDate?: string;
  source?: string;
  trialEndsAt?: string;
}

// Category options with icons
const categories = [
  { value: 'entertainment', label: 'Entertainment', color: 'text-purple-400' },
  { value: 'music', label: 'Music', color: 'text-pink-400' },
  { value: 'education', label: 'Education', color: 'text-blue-400' },
  { value: 'productivity', label: 'Productivity', color: 'text-green-400' },
  { value: 'finance', label: 'Finance', color: 'text-yellow-400' },
  { value: 'health', label: 'Health & Fitness', color: 'text-red-400' },
  { value: 'other', label: 'Other', color: 'text-gray-400' },
];

// Billing cycle options
const billingCycles = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'custom', label: 'Custom' },
];

// Source options
const sources = [
  { value: 'manual', label: 'Manual Entry' },
  { value: 'gmail', label: 'Gmail Import' },
  { value: 'imported', label: 'File Import' },
];

// Currency options
const currencies = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'INR', label: 'INR (₹)', symbol: '₹' },
];

export default function AddSubscriptionForm() {
  const { getToken } = useAuth();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    amount: '',
    currency: 'USD',
    billingCycle: '',
    category: '',
    renewalDate: undefined,
    isTrial: false,
    trialEndsAt: undefined,
    source: 'manual',
    notes: '',
  });

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Get dynamic icon preview
  const serviceIcon = getServiceIcon(formData.name);
  const serviceColors = getServiceColors(formData.name);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Subscription name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    }

    // Billing cycle validation
    if (!formData.billingCycle) {
      newErrors.billingCycle = 'Please select a billing cycle';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    // Renewal date validation
    if (!formData.renewalDate) {
      newErrors.renewalDate = 'Renewal date is required';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.renewalDate);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.renewalDate = 'Renewal date cannot be in the past';
      }
    }

    // Source validation
    if (!formData.source) {
      newErrors.source = 'Please select a source';
    }

    // Trial end date validation
    if (formData.isTrial && !formData.trialEndsAt) {
      newErrors.trialEndsAt = 'Trial end date is required when trial is enabled';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (field: keyof FormData, value: string | boolean | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Reset submit status on any change
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required. Please sign in.');
      }

      await createSubscription(token, {
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        billingCycle: formData.billingCycle as 'monthly' | 'yearly' | 'weekly' | 'custom',
        category: formData.category as 'entertainment' | 'music' | 'education' | 'productivity' | 'finance' | 'health' | 'other',
        renewalDate: formData.renewalDate!.toISOString(),
        isTrial: formData.isTrial,
        trialEndsAt: formData.isTrial && formData.trialEndsAt ? formData.trialEndsAt.toISOString() : undefined,
        source: formData.source as 'manual' | 'gmail' | 'imported',
        status: 'active',
      });

      setSubmitStatus('success');
      
      toast.success('Subscription created', {
        description: `${formData.name} has been added successfully.`,
      });

      // Redirect after success
      setTimeout(() => {
        router.push('/subscriptions');
      }, 1500);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create subscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="SubSentry"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Add Subscription</h1>
            <p className="text-gray-400 text-sm">Track a new recurring payment</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Preview Card */}
        <AnimatePresence>
          {formData.name && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      serviceColors?.bg || 'bg-gray-500/20'
                    )}
                  >
                    {serviceIcon || (
                      <span className={cn('text-sm font-bold', serviceColors?.text || 'text-gray-400')}>
                        {formData.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Preview</p>
                    <p className="font-medium text-white">{formData.name}</p>
                  </div>
                  {formData.amount && (
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {currencies.find((c) => c.value === formData.currency)?.symbol}
                        {parseFloat(formData.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {billingCycles.find((b) => b.value === formData.billingCycle)?.label || 'per period'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" required className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            Subscription Name
          </Label>
          <Input
            id="name"
            placeholder="e.g., Netflix, Spotify, ChatGPT Plus"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!errors.name}
            autoComplete="off"
          />
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.name}
            </motion.p>
          )}
        </div>

        {/* Amount and Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount" required className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="9.99"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              error={!!errors.amount}
            />
            {errors.amount && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.amount}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Billing Cycle and Category */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label required className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              Billing Cycle
            </Label>
            <Select value={formData.billingCycle} onValueChange={(value) => handleChange('billingCycle', value)}>
              <SelectTrigger error={!!errors.billingCycle}>
                <SelectValue placeholder="Select cycle" />
              </SelectTrigger>
              <SelectContent>
                {billingCycles.map((cycle) => (
                  <SelectItem key={cycle.value} value={cycle.value}>
                    {cycle.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.billingCycle && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.billingCycle}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label required className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger error={!!errors.category}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <span className={category.color}>{category.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.category}
              </motion.p>
            )}
          </div>
        </div>

        {/* Renewal Date */}
        <div className="space-y-2">
          <Label htmlFor="renewalDate" required className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            Next Renewal Date
          </Label>
          <DatePicker
            value={formData.renewalDate}
            onChange={(date) => handleChange('renewalDate', date)}
            placeholder="Select renewal date"
            minDate={new Date()}
            error={!!errors.renewalDate}
          />
          {errors.renewalDate && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.renewalDate}
            </motion.p>
          )}
        </div>

        {/* Trial Toggle */}
        <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-white">Free Trial</p>
                <p className="text-sm text-gray-400">Is this a trial subscription?</p>
              </div>
            </div>
            <Switch
              checked={formData.isTrial}
              onCheckedChange={(checked) => handleChange('isTrial', checked)}
            />
          </div>

          <AnimatePresence>
            {formData.isTrial && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
                  <Label htmlFor="trialEndsAt" required>
                    Trial End Date
                  </Label>
                  <div className="mt-2">
                    <DatePicker
                      value={formData.trialEndsAt}
                      onChange={(date) => handleChange('trialEndsAt', date)}
                      placeholder="Select trial end date"
                      minDate={new Date()}
                      error={!!errors.trialEndsAt}
                    />
                  </div>
                  {errors.trialEndsAt && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-400 flex items-center gap-1 mt-2"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.trialEndsAt}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Source */}
        <div className="space-y-2">
          <Label required>Source</Label>
          <Select value={formData.source} onValueChange={(value) => handleChange('source', value)}>
            <SelectTrigger error={!!errors.source}>
              <SelectValue placeholder="How was this added?" />
            </SelectTrigger>
            <SelectContent>
              {sources.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.source && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.source}
            </motion.p>
          )}
        </div>

        {/* Notes (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            Notes
            <span className="text-gray-500 text-xs">(optional)</span>
          </Label>
          <Textarea
            id="notes"
            placeholder="Any additional notes about this subscription..."
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <AnimatePresence mode="wait">
            {submitStatus === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="font-medium text-emerald-400">Subscription Added!</p>
                  <p className="text-sm text-emerald-400/70">Redirecting to subscriptions...</p>
                </div>
              </motion.div>
            ) : submitStatus === 'error' ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-4"
              >
                <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="font-medium text-red-400">Failed to add subscription</p>
                    <p className="text-sm text-red-400/70">{errorMessage}</p>
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="glow"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Try Again
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  type="submit"
                  variant="glow"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding Subscription...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Subscription
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </motion.div>
  );
}
