'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Church, AuditRecord } from '../../../../types/church';
import { getStoredChurches, saveStoredChurches } from '../../../../data/mockChurches';
import { recordVerificationDecision } from '../../../../lib/verification';
import VerifiedBadge from '../../../../components/churches/VerifiedBadge';
import ChurchDetailsModal from '../../../../components/churches/ChurchDetailsModal';
import RejectionModal from '../../../../components/churches/RejectionModal';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  History,
  AlertTriangle,
  Info,
  MapPin,
  Calendar,
  Eye,
  Building,
  UserCheck
} from 'lucide-react';

export default function VerifyChurchesPage() {
  const [churches, setChurches] = useState<Church[]>([]);
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [churchToReject, setChurchToReject] = useState<Church | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'PENDING' | 'ALL_HISTORY'>('PENDING');

  const loadData = () => {
    const list = getStoredChurches();
    setChurches(list);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('churches_updated', handleUpdate);
    return () => window.removeEventListener('churches_updated', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const pendingChurches = useMemo(() => {
    return churches.filter(c => c.verificationStatus === 'pending');
  }, [churches]);

  // Aggregate all audit logs across all churches
  const allAuditLogs = useMemo(() => {
    const logs: AuditRecord[] = [];
    churches.forEach(c => {
      if (c.auditTrail) {
        logs.push(...c.auditTrail);
      }
    });
    return logs.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
  }, [churches]);

  // Approve church
  const handleApprove = (church: Church) => {
    if (!churches.some(c => c.id === church.id && c.verificationStatus === 'pending')) {
      showToast('This church is no longer pending review. Refresh the queue and try again.');
      return;
    }

    const updated = churches.map(c =>
      c.id === church.id ? recordVerificationDecision(c, 'approved') : c
    );

    saveStoredChurches(updated);
    setChurches(updated);
    setSelectedChurch(null);
    showToast(`✅ "${church.name}" has been approved and verified!`);
  };

  // Reject church with reason
  const handleConfirmReject = (churchId: string, reason: string, category: string) => {
    if (!churches.some(c => c.id === churchId && c.verificationStatus === 'pending')) {
      setChurchToReject(null);
      showToast('This church is no longer pending review. Refresh the queue and try again.');
      return;
    }

    const updated = churches.map(c =>
      c.id === churchId
        ? recordVerificationDecision(c, 'rejected', reason, category)
        : c
    );

    saveStoredChurches(updated);
    setChurches(updated);
    setChurchToReject(null);
    setSelectedChurch(null);
    showToast(`⚠️ Application rejected. Rejection reason logged to audit trail.`);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          backgroundColor: '#1E293B',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 12,
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
          zIndex: 2000,
          fontSize: 14,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          {toastMessage}
        </div>
      )}

      {/* Back to Churches */}
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/churches"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--color-primary)',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={16} />
          Back to Church Directory
        </Link>
      </div>

      {/* Page Title & Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            Church Verification &amp; Audit Trail
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-warm-gray)', marginTop: 4 }}>
            Review pending onboarding applications, inspect legal credentials, approve/reject with logged reasons, and inspect compliance audit history.
          </p>
        </div>

        {/* View Filter Pill */}
        <div className="verification-mode-tabs" style={{
          display: 'inline-flex',
          backgroundColor: '#F3F4F6',
          borderRadius: 10,
          padding: 3,
          border: '1px solid #E5E7EB'
        }}>
          <button
            onClick={() => setFilterMode('PENDING')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              backgroundColor: filterMode === 'PENDING' ? '#FFFFFF' : 'transparent',
              color: filterMode === 'PENDING' ? 'var(--color-primary)' : 'var(--color-warm-gray)',
              boxShadow: filterMode === 'PENDING' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            Pending Verification Queue
            <span style={{
              backgroundColor: filterMode === 'PENDING' ? 'var(--color-primary)' : '#9CA3AF',
              color: 'white',
              padding: '1px 6px',
              borderRadius: 999,
              fontSize: 11
            }}>
              {pendingChurches.length}
            </span>
          </button>

          <button
            onClick={() => setFilterMode('ALL_HISTORY')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              backgroundColor: filterMode === 'ALL_HISTORY' ? '#FFFFFF' : 'transparent',
              color: filterMode === 'ALL_HISTORY' ? 'var(--color-primary)' : 'var(--color-warm-gray)',
              boxShadow: filterMode === 'ALL_HISTORY' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <History size={14} />
            Global Audit History ({allAuditLogs.length})
          </button>
        </div>
      </div>

      {/* Compliance / Prototype Disclaimer Banner */}
      <div style={{
        padding: '12px 16px',
        borderRadius: 10,
        backgroundColor: '#FEF3C7',
        border: '1px solid #FDE68A',
        color: '#92400E',
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 24
      }}>
        <Info size={18} style={{ flexShrink: 0 }} />
        <span>
          <b>FR-CHURCH-06 Audit Integrity Notice:</b> Administrative audit trail entries are maintained in the local session datastore for prototype review. Records are not permanently committed to the backend database until production API synchronization is established.
        </span>
      </div>

      {filterMode === 'PENDING' ? (
        /* PENDING QUEUE SECTION */
        <div>
          {pendingChurches.length === 0 ? (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 48,
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                color: '#16A34A',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>
                All Caught Up!
              </h3>
              <p style={{ color: 'var(--color-warm-gray)', fontSize: 14, maxWidth: 440, margin: '8px auto 20px' }}>
                There are currently no church onboarding applications awaiting administrative review.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                <Link
                  href="/admin/churches/new"
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  Register New Church
                </Link>
                <button
                  onClick={() => setFilterMode('ALL_HISTORY')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    backgroundColor: '#F3F4F6',
                    color: '#374151',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  View Historical Audit Log
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {pendingChurches.map((church) => (
                <div
                  key={church.id}
                  className="verification-card"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 16,
                    padding: 24,
                    boxShadow: 'var(--shadow-card)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {/* Church Avatar */}
                    <div style={{
                      width: 58,
                      height: 58,
                      borderRadius: 14,
                      backgroundColor: church.avatarBg,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {church.avatarInitials}
                    </div>

                    {/* Church Details */}
                    <div style={{ flex: 1, minWidth: 280 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                          {church.name}
                        </h3>
                        <span style={{
                          backgroundColor: '#FEF3C7',
                          color: '#92400E',
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700
                        }}>
                          PENDING VERIFICATION
                        </span>
                        {/* Notice FR-CHURCH-04: VerifiedBadge is NOT shown here */}
                      </div>

                      <p style={{ fontSize: 13, color: 'var(--color-warm-gray)', marginTop: 4 }}>
                        {church.denomination} • Founded {church.founded} • Senior Pastor: <b>{church.pastor}</b>
                      </p>

                      <div className="verification-card-contact" style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--color-warm-gray)', margin: '8px 0 14px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
                          {church.address}, {church.city}, {church.state} - {church.pincode}
                        </span>
                        <span>•</span>
                        <span>Email: {church.email}</span>
                        <span>•</span>
                        <span>Phone: {church.phone}</span>
                      </div>

                      <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.5, marginBottom: 16 }}>
                        {church.about}
                      </p>

                      {/* Submitted Verification Documents Section */}
                      <div style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: 12,
                        padding: 16,
                        border: '1px solid #E2E8F0',
                        marginBottom: 18
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-warm-gray)', textTransform: 'uppercase', marginBottom: 10 }}>
                          Submitted Verification Documents ({church.documents.length})
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
                          {church.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="verification-doc-card"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#FFFFFF',
                                padding: '10px 14px',
                                borderRadius: 8,
                                border: '1px solid #E5E7EB'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FileText size={16} style={{ color: 'var(--color-primary)' }} />
                                <div>
                                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>
                                    {doc.name}
                                  </div>
                                  <div style={{ fontSize: 11, color: 'var(--color-warm-gray)' }}>
                                    {doc.fileName} ({doc.fileSize})
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => alert('This prototype stores document names and metadata only; file contents are not available to preview.')}
                                style={{
                                  backgroundColor: '#F3F4F6',
                                  border: 'none',
                                  borderRadius: 6,
                                  padding: '4px 8px',
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: 'var(--color-primary)',
                                  cursor: 'pointer'
                                }}
                              >
                                Details
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="verification-card-actions" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleApprove(church)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '10px 18px',
                            borderRadius: 8,
                            border: 'none',
                            backgroundColor: '#10B981',
                            color: 'white',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(16,185,129,0.2)'
                          }}
                        >
                          <CheckCircle2 size={16} />
                          Approve &amp; Grant Verified Badge
                        </button>

                        <button
                          onClick={() => setChurchToReject(church)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '10px 18px',
                            borderRadius: 8,
                            border: 'none',
                            backgroundColor: '#DC2626',
                            color: 'white',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <XCircle size={16} />
                          Reject with Reason
                        </button>

                        <button
                          onClick={() => setSelectedChurch(church)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
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
                          <Eye size={16} />
                          Inspect Full Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* GLOBAL AUDIT TRAIL VIEW */
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 24,
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
              Chronological Audit Trail Records
            </h3>
            <span style={{ fontSize: 13, color: 'var(--color-warm-gray)' }}>
              Total events logged: {allAuditLogs.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {allAuditLogs.map((log) => {
              const isApproval = log.action === 'CHURCH_VERIFIED';
              const isRejection = log.action === 'CHURCH_REJECTED';
              const isRegistered = log.action === 'CHURCH_REGISTERED';

              const badgeColor = isApproval ? '#DCFCE7' : isRejection ? '#FEE2E2' : '#F3E8FF';
              const textColor = isApproval ? '#15803D' : isRejection ? '#B91C1C' : '#6B21A8';
              const borderLeftColor = isApproval ? '#10B981' : isRejection ? '#DC2626' : '#9333EA';

              return (
                <div
                  key={log.id}
                  style={{
                    borderLeft: `4px solid ${borderLeftColor}`,
                    backgroundColor: '#F8FAFC',
                    borderRadius: '0 10px 10px 0',
                    padding: '14px 18px',
                    border: '1px solid #E2E8F0',
                    borderLeftWidth: 4
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{
                          backgroundColor: badgeColor,
                          color: textColor,
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700
                        }}>
                          {log.action.replace('_', ' ')}
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>
                          {log.churchName}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--color-warm-gray)', marginTop: 4 }}>
                        Reviewed by: <b>{log.reviewer}</b> • Role: <code>{log.role}</code>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-warm-gray)' }}>
                      <Clock size={13} />
                      {log.timestamp}
                    </div>
                  </div>

                  {log.reason && (
                    <div style={{
                      marginTop: 8,
                      padding: '8px 12px',
                      backgroundColor: '#FEE2E2',
                      borderRadius: 8,
                      border: '1px solid #FECACA',
                      color: '#991B1B',
                      fontSize: 13
                    }}>
                      <b>Rejection Rationale:</b> {log.reason}
                    </div>
                  )}

                  {log.details && (
                    <div style={{ fontSize: 13, color: '#4B5563', marginTop: 6 }}>
                      {log.details}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Profile Detail Modal (FR-CHURCH-02) */}
      <ChurchDetailsModal
        church={selectedChurch}
        onClose={() => setSelectedChurch(null)}
        onApprove={handleApprove}
        onReject={(c) => {
          setSelectedChurch(null);
          setChurchToReject(c);
        }}
      />

      {/* Rejection Reason Modal (FR-CHURCH-06) */}
      <RejectionModal
        church={churchToReject}
        onClose={() => setChurchToReject(null)}
        onConfirmReject={handleConfirmReject}
      />
    </div>
  );
}
