'use client';
import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { CanonicalVerificationStatus, Church } from '../../types/church';

interface VerifiedBadgeProps {
  church?: Pick<Church, 'verificationStatus'>;
  verificationStatus?: CanonicalVerificationStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

/**
 * FR-CHURCH-04: Verification Badge
 * Show Verified ONLY when verificationStatus === "approved".
 * Pending churches show Pending. Rejected churches show Rejected.
 */
export default function VerifiedBadge({
  church,
  verificationStatus,
  size = 'md',
  showLabel = true
}: VerifiedBadgeProps) {
  const rawStatus = verificationStatus ?? church?.verificationStatus;
  const canonical: CanonicalVerificationStatus =
    rawStatus === 'approved' || rawStatus === 'rejected' ? rawStatus : 'pending';

  const iconSizes = { sm: 14, md: 16, lg: 20 };
  const padding = size === 'sm' ? '2px 6px' : size === 'lg' ? '4px 10px' : '2px 8px';
  const fontSize = size === 'sm' ? 11 : size === 'lg' ? 13 : 12;

  const variants: Record<CanonicalVerificationStatus, { bg: string; color: string; border: string; label: string; icon: React.ReactNode }> = {
    approved: {
      bg: '#EFF6FF',
      color: '#2563EB',
      border: '#BFDBFE',
      label: 'Verified',
      icon: <CheckCircle2 size={iconSizes[size]} style={{ flexShrink: 0 }} />
    },
    pending: {
      bg: '#FEF3C7',
      color: '#92400E',
      border: '#FDE68A',
      label: 'Pending',
      icon: <Clock size={iconSizes[size]} style={{ flexShrink: 0 }} />
    },
    rejected: {
      bg: '#FEE2E2',
      color: '#B91C1C',
      border: '#FECACA',
      label: 'Rejected',
      icon: <XCircle size={iconSizes[size]} style={{ flexShrink: 0 }} />
    }
  };

  const variant = variants[canonical];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        backgroundColor: variant.bg,
        color: variant.color,
        border: `1px solid ${variant.border}`,
        borderRadius: 9999,
        padding,
        fontSize,
        fontWeight: 700,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        userSelect: 'none'
      }}
      title={`Verification status: ${variant.label}`}
      aria-label={`Verification status: ${variant.label}`}
    >
      {variant.icon}
      {showLabel && <span>{variant.label}</span>}
    </span>
  );
}
