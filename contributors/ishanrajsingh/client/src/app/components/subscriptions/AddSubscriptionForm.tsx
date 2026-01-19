'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
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
import { toast } from 'sonner';

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
  { value: 'entertainment', label: 'Entertainment', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { value: 'music', label: 'Music', color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { value: 'education', label: 'Education', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { value: 'productivity', label: 'Productivity', color: 'text-green-400', bg: 'bg-green-500/10' },
  { value: 'finance', label: 'Finance', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { value: 'health', label: 'Health & Fitness', color: 'text-red-400', bg: 'bg-red-500/10' },
  { value: 'other', label: 'Other', color: 'text-gray-400', bg: 'bg-gray-500/10' },
];

// Billing cycle options
const billingCycles = [
  { value: 'monthly', label: 'Monthly', icon: '📅' },
  { value: 'yearly', label: 'Yearly', icon: '🗓️' },
  { value: 'weekly', label: 'Weekly', icon: '📆' },
  { value: 'custom', label: 'Custom', icon: '⚙️' },
];

// Source options
const sources = [
  { value: 'manual', label: 'Manual Entry', icon: '✍️' },
  { value: 'gmail', label: 'Gmail Import', icon: '📧' },
  { value: 'imported', label: 'File Import', icon: '📁' },
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

    if (!formData.name.trim()) {
      newErrors.name = 'Subscription name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    }

    if (!formData.billingCycle) {
      newErrors.billingCycle = 'Please select a billing cycle';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

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

    if (!formData.source) {
      newErrors.source = 'Please select a source';
    }

    if (formData.isTrial && !formData.trialEndsAt) {
      newErrors.trialEndsAt = 'Trial end date is required when trial is enabled';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (field: keyof FormData, value: string | boolean | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-all mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Back to Subscriptions</span>
          </motion.button>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl" />
            <div className="relative bg-[#0f0f0f]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Add New Subscription
                  </h1>
                  <p className="text-gray-400 mt-1">Track and manage your recurring payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <AnimatePresence>
          {formData.name && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="mb-8"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={cn(
                        'w-14 h-14 rounded-xl flex items-center justify-center shadow-lg',
                        serviceColors?.bg || 'bg-gradient-to-br from-gray-500/30 to-gray-600/30'
                      )}
                    >
                      {serviceIcon || (
                        <span className={cn('text-2xl font-bold', serviceColors?.text || 'text-white')}>
                          {formData.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-xs text-blue-400 font-medium uppercase tracking-wider mb-1">
                        Live Preview
                      </p>
                      <p className="text-xl font-bold text-white">{formData.name}</p>
                      {formData.category && (
                        <span className={cn(
                          'text-xs px-2 py-1 rounded-full',
                          categories.find(c => c.value === formData.category)?.bg,
                          categories.find(c => c.value === formData.category)?.color
                        )}>
                          {categories.find(c => c.value === formData.category)?.label}
                        </span>
                      )}
                    </div>
                    {formData.amount && (
                      <div className="text-right">
                        <p className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                          {currencies.find((c) => c.value === formData.currency)?.symbol}
                          {parseFloat(formData.amount).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {billingCycles.find((b) => b.value === formData.billingCycle)?.label || 'per period'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Form Card */}
          <div className="bg-[#0f0f0f]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-white">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  Subscription Name
                  <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Netflix, Spotify, ChatGPT Plus"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={cn(
                    'bg-white/5 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 text-white placeholder:text-gray-500',
                    errors.name && 'border-red-500/50 focus:border-red-500'
                  )}
                  autoComplete="off"
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Amount and Currency Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="amount" className="flex items-center gap-2 text-white">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    Amount
                    <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="9.99"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    className={cn(
                      'bg-white/5 border-white/10 focus:border-green-500/50 focus:ring-green-500/20 text-white text-lg font-semibold',
                      errors.amount && 'border-red-500/50'
                    )}
                  />
                  {errors.amount && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.amount}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-white">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-white">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Billing Cycle
                    <span className="text-red-400">*</span>
                  </Label>
                  <Select value={formData.billingCycle} onValueChange={(value) => handleChange('billingCycle', value)}>
                    <SelectTrigger className={cn('bg-white/5 border-white/10 text-white', errors.billingCycle && 'border-red-500/50')}>
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      {billingCycles.map((cycle) => (
                        <SelectItem key={cycle.value} value={cycle.value}>
                          <span className="flex items-center gap-2">
                            <span>{cycle.icon}</span>
                            {cycle.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.billingCycle && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.billingCycle}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-white">
                    <Tag className="w-4 h-4 text-pink-400" />
                    Category
                    <span className="text-red-400">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger className={cn('bg-white/5 border-white/10 text-white', errors.category && 'border-red-500/50')}>
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
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
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
                <Label className="flex items-center gap-2 text-white">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Next Renewal Date
                  <span className="text-red-400">*</span>
                </Label>
                <DatePicker
                  value={formData.renewalDate}
                  onChange={(date) => handleChange('renewalDate', date)}
                  placeholder="Select renewal date"
                  minDate={new Date()}
                />
                {errors.renewalDate && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.renewalDate}
                  </motion.p>
                )}
              </div>

              {/* Trial Toggle Card */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-5 rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Free Trial Period</p>
                        <p className="text-sm text-gray-400">Is this subscription currently on trial?</p>
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
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 pt-5 border-t border-amber-500/20">
                          <Label className="text-white mb-2 block">
                            Trial End Date <span className="text-red-400">*</span>
                          </Label>
                          <DatePicker
                            value={formData.trialEndsAt}
                            onChange={(date) => handleChange('trialEndsAt', date)}
                            placeholder="When does the trial end?"
                            minDate={new Date()}
                          />
                          {errors.trialEndsAt && (
                            <motion.p
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
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
              </motion.div>

              {/* Source */}
              <div className="space-y-2">
                <Label className="text-white">
                  Source <span className="text-red-400">*</span>
                </Label>
                <Select value={formData.source} onValueChange={(value) => handleChange('source', value)}>
                  <SelectTrigger className={cn('bg-white/5 border-white/10 text-white', errors.source && 'border-red-500/50')}>
                    <SelectValue placeholder="How was this subscription added?" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
                      <SelectItem key={source.value} value={source.value}>
                        <span className="flex items-center gap-2">
                          <span>{source.icon}</span>
                          {source.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.source && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.source}
                  </motion.p>
                )}
              </div>

              {/* Notes (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2 text-white">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Notes
                  <span className="text-gray-500 text-xs">(optional)</span>
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes about this subscription..."
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={4}
                  className="bg-white/5 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <AnimatePresence mode="wait">
            {submitStatus === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur-xl" />
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-emerald-400">Subscription Added Successfully!</p>
                    <p className="text-sm text-emerald-400/70">Redirecting you to your subscriptions...</p>
                  </div>
                </div>
              </motion.div>
            ) : submitStatus === 'error' ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/30 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-red-400">Failed to Add Subscription</p>
                    <p className="text-sm text-red-400/70 mt-1">{errorMessage}</p>
                  </div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/20 h-14 text-lg font-semibold"
                  disabled={isSubmitting}
                >
                  Try Again
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-500 hover:via-purple-400 hover:to-pink-400 text-white shadow-2xl shadow-purple-500/30 h-16 text-lg font-bold group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Adding Subscription...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                      Add Subscription
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}
