'use client';
import React, { useState } from 'react';
import { Church } from '../../types/church';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';

interface RejectionModalProps {
  church: Church | null;
  onClose: () => void;
  onConfirmReject: (churchId: string, reason: string, category: string) => void;
}

const REJECTION_CATEGORIES = [
  'Missing or Incomplete Trust / Society Registration',
  'Pastoral Credentials Unverifiable / Expired',
  'Physical Address Could Not Be Confirmed',
  'Missing 80G / Legal Authorization Documents',
  'Duplicate Church Registration Profile',
  'Other Administrative Non-Compliance'
];

export default function RejectionModal({
  church,
  onClose,
  onConfirmReject
}: RejectionModalProps) {
  const [selectedCategory, setSelectedCategory] = useState(REJECTION_CATEGORIES[0]);
  const [detailedReason, setDetailedReason] = useState('');
  const [error, setError] = useState('');

  if (!church) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailedReason.trim()) {
      setError('Please provide a specific explanation for the church administrator.');
      return;
    }
    const fullReason = `[${selectedCategory}] ${detailedReason.trim()}`;
    onConfirmReject(church.id, fullReason, selectedCategory);
  };

  return (
    <div className="rejection-modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1100,
      padding: 16
    }}>
      <div className="rejection-modal" style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: 520,
        borderRadius: 16,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        animation: 'scaleUp 0.18s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #FEE2E2',
          backgroundColor: '#FEF2F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #FECACA'
            }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#991B1B', margin: 0 }}>
                Reject Church Application
              </h3>
              <p style={{ fontSize: 12, color: '#B91C1C', margin: '2px 0 0' }}>
                FR-CHURCH-06 Rejection &amp; Audit Trail Record
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          <div style={{
            padding: 12,
            backgroundColor: '#F8FAFC',
            borderRadius: 10,
            border: '1px solid #E2E8F0',
            marginBottom: 18,
            fontSize: 13
          }}>
            Rejecting application for: <b>{church.name}</b> ({church.city})<br />
            Senior Pastor: <b>{church.pastor}</b>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
              Primary Rejection Category *
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #D1D5DB',
                fontSize: 13,
                backgroundColor: '#FFFFFF',
                color: 'var(--color-text)'
              }}
            >
              {REJECTION_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
              Detailed Feedback &amp; Rejection Reason *
            </label>
            <textarea
              rows={4}
              value={detailedReason}
              onChange={(e) => {
                setDetailedReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="State clear reasons why the application was declined and what additional documents or steps the applicant must provide..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: error ? '1.5px solid #DC2626' : '1px solid #D1D5DB',
                fontSize: 13,
                fontFamily: 'inherit',
                resize: 'vertical',
                color: 'var(--color-text)'
              }}
            />
            {error && (
              <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{error}</p>
            )}
          </div>

          <div style={{
            padding: '10px 14px',
            backgroundColor: '#FEF3C7',
            borderRadius: 8,
            border: '1px solid #FDE68A',
            fontSize: 12,
            color: '#92400E',
            display: 'flex',
            gap: 8,
            marginBottom: 20
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              This rejection and rationale will be logged in the administrative audit trail, and the applicant's status will be updated to <b>REJECTED</b>.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: '1px solid #D1D5DB',
                backgroundColor: '#FFFFFF',
                color: '#374151',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
