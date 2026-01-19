'use client';

import { Subscription } from '@/lib/api';
import {
  cn,
  formatCurrency,
  formatDate,
  getDaysUntilRenewal,
  isUrgentRenewal,
  getCategoryColor,
  getStatusColor,
  getBillingCycleLabel,
} from '@/lib/utils';
import { getServiceIcon, getServiceColors } from '@/lib/service-icons';
import { 
  Calendar, 
  AlertTriangle,
  MoreVertical,
  Trash2,
  Edit,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SubscriptionCardProps {
  subscription: Subscription;
  view?: 'grid' | 'list';
  index?: number;
  onEdit?: (subscription: Subscription) => void;
  onDelete?: (subscription: Subscription) => void;
}

export default function SubscriptionCard({ subscription, view = 'grid', index = 0, onEdit, onDelete }: SubscriptionCardProps) {
  const daysUntil = getDaysUntilRenewal(subscription.renewalDate);
  const isUrgent = isUrgentRenewal(subscription.renewalDate);
  const categoryColors = getCategoryColor(subscription.category);
  const statusColors = getStatusColor(subscription.status);
  
  // Get service-specific icon and colors
  const serviceIcon = getServiceIcon(subscription.name);
  const serviceColors = getServiceColors(subscription.name);

  const initials = subscription.name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Use service colors if available, otherwise fall back to category colors
  const iconBg = serviceColors?.bg || categoryColors.bg;
  const iconText = serviceColors?.text || categoryColors.text;

  const getRenewalText = () => {
    if (daysUntil < 0) return 'Overdue';
    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    return `${daysUntil} days`;
  };

  if (view === 'list') {
    return (
      <TooltipProvider>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.01, x: 4 }}
          className={cn(
            'group flex items-center gap-4 p-4 bg-[#0f0f0f] rounded-xl border transition-all duration-200 hover:bg-[#141414]',
            isUrgent ? 'border-amber-500/30 hover:border-amber-500/50' : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
          )}
        >
          {/* Icon/Logo */}
          <motion.div 
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0',
              iconBg,
              iconText
            )}
          >
            {serviceIcon || initials}
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{subscription.name}</h3>
              {/* FIXED: Removed border property */}
              <Badge variant="outline" className={cn('text-xs shrink-0 border', statusColors.bg, statusColors.text)}>
                {subscription.status}
              </Badge>
              {subscription.isTrial && (
                <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30 shrink-0">
                  Trial
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="font-medium text-white">
                {formatCurrency(subscription.amount, subscription.currency)}
              </span>
              <span className="text-gray-500">/</span>
              <span>{getBillingCycleLabel(subscription.billingCycle)}</span>
              <span className="text-gray-500">•</span>
              <span className="capitalize">{subscription.category}</span>
            </div>
          </div>

          {/* Renewal */}
          <div className="flex items-center gap-4 shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
                  isUrgent ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                )}>
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{getRenewalText()}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Renews on {formatDate(subscription.renewalDate)}</p>
              </TooltipContent>
            </Tooltip>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#0f0f0f] border-[#1a1a1a]">
                <DropdownMenuItem onClick={() => onEdit?.(subscription)} className="cursor-pointer">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#1a1a1a]" />
                <DropdownMenuItem onClick={() => onDelete?.(subscription)} className="cursor-pointer text-red-400 focus:text-red-400">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      </TooltipProvider>
    );
  }

  // Grid view
  return (
    <TooltipProvider>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ scale: 1.02, y: -4 }}
        className={cn(
          'group relative bg-[#0f0f0f] rounded-2xl border overflow-hidden transition-all duration-200',
          isUrgent ? 'border-amber-500/30 hover:border-amber-500/50' : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
        )}
      >
        {/* Background gradient - FIXED: Removed gradient property */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
              className={cn(
                'w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold',
                iconBg,
                iconText
              )}
            >
              {serviceIcon || initials}
            </motion.div>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#0f0f0f] border-[#1a1a1a]">
                <DropdownMenuItem onClick={() => onEdit?.(subscription)} className="cursor-pointer">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#1a1a1a]" />
                <DropdownMenuItem onClick={() => onDelete?.(subscription)} className="cursor-pointer text-red-400 focus:text-red-400">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title and badges */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2 truncate">{subscription.name}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {/* FIXED: Removed border property */}
              <Badge variant="outline" className={cn('text-xs border', statusColors.bg, statusColors.text)}>
                {subscription.status}
              </Badge>
              {subscription.isTrial && (
                <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30">
                  Trial
                </Badge>
              )}
              {/* FIXED: Removed border property */}
              <Badge variant="outline" className={cn('text-xs capitalize border', categoryColors.bg, categoryColors.text)}>
                {subscription.category}
              </Badge>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              {formatCurrency(subscription.amount, subscription.currency)}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              per {getBillingCycleLabel(subscription.billingCycle).toLowerCase()}
            </div>
          </div>

          {/* Renewal info */}
          <div className={cn(
            'flex items-center gap-2 p-3 rounded-xl',
            isUrgent ? 'bg-amber-500/10' : 'bg-blue-500/10'
          )}>
            {isUrgent && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            <Calendar className={cn('w-4 h-4 shrink-0', isUrgent ? 'text-amber-400' : 'text-blue-400')} />
            <div className="flex-1 min-w-0">
              <div className={cn('text-sm font-medium', isUrgent ? 'text-amber-400' : 'text-blue-400')}>
                {isUrgent ? 'Renewing Soon' : 'Next Renewal'}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {formatDate(subscription.renewalDate)} • {getRenewalText()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
