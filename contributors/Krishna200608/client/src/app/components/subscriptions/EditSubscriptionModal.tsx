'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CreditCard,
  DollarSign,
  Clock,
  Tag,
  Calendar,
  Zap,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';
import { Subscription } from '@/lib/api';
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
import * as Dialog from '@radix-ui/react-dialog';

interface EditSubscriptionModalProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<Subscription>) => Promise<void>;
}

interface FormData {
  name: string;
  amount: string;
  currency: string;
  billingCycle: string;
  category: string;
  renewalDate: Date | undefined;
  isTrial: boolean;
  trialEndsAt: Date | undefined;
  status: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  amount?: string;
  billingCycle?: string;
  category?: string;
  renewalDate?: string;
  trialEndsAt?: string;
}

const categories = [
  { value: 'entertainment', label: 'Entertainment', color: 'text-purple-400' },
  { value: 'music', label: 'Music', color: 'text-pink-400' },
  { value: 'education', label: 'Education', color: 'text-blue-400' },
  { value: 'productivity', label: 'Productivity', color: 'text-green-400' },
  { value: 'finance', label: 'Finance', color: 'text-yellow-400' },
  { value: 'health', label: 'Health & Fitness', color: 'text-red-400' },
  { value: 'other', label: 'Other', color: 'text-gray-400' },
];

const billingCycles = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'custom', label: 'Custom' },
];

const currencies = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'INR', label: 'INR (₹)', symbol: '₹' },
];

const statuses = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function EditSubscriptionModal({
  subscription,
  isOpen,
  onClose,
  onSave,
}: EditSubscriptionModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    amount: '',
    currency: 'USD',
    billingCycle: '',
    category: '',
    renewalDate: undefined,
    isTrial: false,
    trialEndsAt: undefined,
    status: 'active',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill form when subscription changes
  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        amount: subscription.amount.toString(),
        currency: subscription.currency,
        billingCycle: subscription.billingCycle,
        category: subscription.category,
        renewalDate: new Date(subscription.renewalDate),
        isTrial: subscription.isTrial,
        trialEndsAt: subscription.trialEndsAt ? new Date(subscription.trialEndsAt) : undefined,
        status: subscription.status,
        notes: '',
      });
      setErrors({});
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  }, [subscription]);

  const serviceIcon = getServiceIcon(formData.name);
  const serviceColors = getServiceColors(formData.name);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
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
    }

    if (formData.isTrial && !formData.trialEndsAt) {
      newErrors.trialEndsAt = 'Trial end date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string | boolean | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !subscription) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await onSave(subscription._id, {
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        billingCycle: formData.billingCycle as 'monthly' | 'yearly' | 'weekly' | 'custom',
        category: formData.category as 'entertainment' | 'music' | 'education' | 'productivity' | 'finance' | 'health' | 'other',
        renewalDate: formData.renewalDate!.toISOString(),
        isTrial: formData.isTrial,
        trialEndsAt: formData.isTrial && formData.trialEndsAt ? formData.trialEndsAt.toISOString() : undefined,
        status: formData.status as 'active' | 'paused' | 'cancelled',
      });

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update subscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl shadow-2xl z-50"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#2a2a2a] p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    serviceColors?.bg || 'bg-blue-500/20'
                  )}
                >
                  {serviceIcon || (
                    <span className={cn('text-sm font-bold', serviceColors?.text || 'text-blue-400')}>
                      {formData.name.charAt(0).toUpperCase() || 'E'}
                    </span>
                  )}
                </div>
                <div>
                  <Dialog.Title className="text-lg font-semibold text-white">
                    Edit Subscription
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-gray-400">
                    Update subscription details
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  className="p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors text-gray-400 hover:text-white"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-name" required className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  Subscription Name
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={!!errors.name}
                />
                {errors.name && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Amount and Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-amount" required className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    Amount
                  </Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    error={!!errors.amount}
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.amount}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={formData.currency} onValueChange={(v) => handleChange('currency', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
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
                  <Select value={formData.billingCycle} onValueChange={(v) => handleChange('billingCycle', v)}>
                    <SelectTrigger error={!!errors.billingCycle}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {billingCycles.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.billingCycle && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.billingCycle}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label required className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    Category
                  </Label>
                  <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                    <SelectTrigger error={!!errors.category}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          <span className={c.color}>{c.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Renewal Date and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label required className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Renewal Date
                  </Label>
                  <DatePicker
                    value={formData.renewalDate}
                    onChange={(date) => handleChange('renewalDate', date)}
                    placeholder="Select date"
                    error={!!errors.renewalDate}
                  />
                  {errors.renewalDate && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.renewalDate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                      <p className="text-sm text-gray-400">Is this a trial?</p>
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
                        <Label required>Trial End Date</Label>
                        <div className="mt-2">
                          <DatePicker
                            value={formData.trialEndsAt}
                            onChange={(date) => handleChange('trialEndsAt', date)}
                            placeholder="Select trial end date"
                            error={!!errors.trialEndsAt}
                          />
                        </div>
                        {errors.trialEndsAt && (
                          <p className="text-sm text-red-400 flex items-center gap-1 mt-2">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.trialEndsAt}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Status */}
              <AnimatePresence mode="wait">
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <p className="font-medium text-emerald-400">Subscription Updated!</p>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="font-medium text-red-400">Update Failed</p>
                      <p className="text-sm text-red-400/70">{errorMessage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2a2a2a]">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="glow"
                  disabled={isSubmitting || submitStatus === 'success'}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
