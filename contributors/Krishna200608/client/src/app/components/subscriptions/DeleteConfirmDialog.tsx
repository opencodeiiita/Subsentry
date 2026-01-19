'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Trash2, Loader2, X } from 'lucide-react';
import { Subscription } from '@/lib/api';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getServiceIcon, getServiceColors } from '@/lib/service-icons';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

interface DeleteConfirmDialogProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export default function DeleteConfirmDialog({
  subscription,
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const serviceIcon = subscription ? getServiceIcon(subscription.name) : null;
  const serviceColors = subscription ? getServiceColors(subscription.name) : null;

  const handleConfirm = async () => {
    if (!subscription) return;

    setIsDeleting(true);
    setError('');

    try {
      await onConfirm(subscription._id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subscription');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError('');
      onClose();
    }
  };

  if (!subscription) return null;

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
        </AlertDialog.Overlay>
        <AlertDialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl shadow-2xl z-50 p-6"
          >
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>

            {/* Title */}
            <AlertDialog.Title className="text-xl font-semibold text-white text-center mb-2">
              Delete Subscription?
            </AlertDialog.Title>

            {/* Description */}
            <AlertDialog.Description className="text-gray-400 text-center mb-6">
              This action cannot be undone. The subscription will be permanently removed from your account.
            </AlertDialog.Description>

            {/* Subscription Preview */}
            <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center',
                    serviceColors?.bg || 'bg-gray-500/20'
                  )}
                >
                  {serviceIcon || (
                    <span className={cn('text-sm font-bold', serviceColors?.text || 'text-gray-400')}>
                      {subscription.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{subscription.name}</p>
                  <p className="text-sm text-gray-400">
                    {formatCurrency(subscription.amount, subscription.currency)} / {subscription.billingCycle}
                  </p>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 mb-4"
              >
                <p className="text-sm text-red-400 text-center">{error}</p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <AlertDialog.Cancel asChild>
                <Button
                  variant="secondary"
                  className="flex-1"
                  disabled={isDeleting}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
