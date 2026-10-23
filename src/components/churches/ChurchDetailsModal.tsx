'use client';
import React, { useState } from 'react';
import { Church } from '../../types/church';
import VerifiedBadge from './VerifiedBadge';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Mail,
  Phone,
  Globe,
  Radio,
  FileText,
  ShieldCheck,
  History,
  ExternalLink,
  Users,
  Video,
  Image as ImageIcon
} from 'lucide-react';

interface ChurchDetailsModalProps {
  church: Church | null;
  onClose: () => void;
  onApprove?: (church: Church) => void;
  onReject?: (church: Church) => void;
}

export default function ChurchDetailsModal({
  church,
  onClose,
  onApprove,
  onReject
}: ChurchDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'media' | 'documents' | 'audit'>('overview');

  if (!church) return null;

  return (
    <div className="church-profile-overlay" style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: 20
    }}>
      <div className="church-profile-modal" style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: 820,
        maxHeight: '90vh',
        borderRadius: 20,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header Banner */}
        <div className="church-profile-header" style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #3D1A6E 0%, #5B2D8E 100%)',
          color: 'white',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer'
            }}
            title="Close dialog"
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div className="church-profile-avatar" style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              backgroundColor: church.avatarBg,
              border: '3px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 800,
              flexShrink: 0
            }}>
              {church.avatarInitials}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                  {church.name}
                </h2>
                {/* FR-CHURCH-04: Strict Verified Badge check */}
                <VerifiedBadge church={church} size="md" showLabel />
                {church.isLive && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    backgroundColor: '#DC2626',
                    color: 'white',
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700
                  }}>
                    <Radio size={13} />
                    LIVE STREAMING
                  </span>
                )}
                {church.verificationStatus === 'pending' && (
                  <span style={{
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    Pending Verification
                  </span>
                )}
                {church.verificationStatus === 'rejected' && (
                  <span style={{
                    backgroundColor: '#FEE2E2',
                    color: '#B91C1C',
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    Application Rejected
                  </span>
                )}
              </div>

              <p style={{ marginTop: 6, fontSize: 14, opacity: 0.9 }}>
                {church.denomination} • Founded {church.founded} • Senior Pastor: {church.pastor}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="church-profile-tabs" style={{
          display: 'flex',
          borderBottom: '1px solid #E5E7EB',
          padding: '0 24px',
          backgroundColor: '#FAFAF9'
        }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'services', label: `Service Timings (${church.serviceTimings.length})` },
            { id: 'media', label: 'Media & Channels' },
            { id: 'documents', label: `Verification Documents (${church.documents.length})` },
            { id: 'audit', label: `Audit Trail (${church.auditTrail.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '14px 18px',
                border: 'none',
                background: 'none',
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-warm-gray)',
                borderBottom: activeTab === tab.id ? '3px solid var(--color-primary)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="church-profile-body" style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-warm-gray)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                  About the Church
                </h4>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text)' }}>
                  {church.about}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div style={{ padding: 14, borderRadius: 12, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', marginBottom: 4 }}>
                    <MapPin size={16} />
                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Physical Address</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text)' }}>
                    {church.address}<br />
                    {church.city}, {church.state} - {church.pincode}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--color-warm-gray)', marginTop: 4 }}>
                    Distance: <b>{church.distanceKm} km</b>
                  </p>
                </div>

                <div style={{ padding: 14, borderRadius: 12, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669', marginBottom: 4 }}>
                    <Phone size={16} />
                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Contact Information</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text)' }}>
                    Phone: {church.phone}<br />
                    Email: {church.email}
                  </p>
                  {church.website && (
                    <a
                      href={church.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 12, color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}
                    >
                      Visit Website <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                <div style={{ padding: 14, borderRadius: 12, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#D97706', marginBottom: 4 }}>
                    <Users size={16} />
                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Community Metrics</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text)' }}>
                    Active Members: <b>{church.members.toLocaleString()}</b><br />
                    Denomination: <b>{church.denomination}</b><br />
                    Established: <b>Year {church.founded}</b>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SERVICE TIMINGS */}
          {activeTab === 'services' && (
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: 'var(--color-text)' }}>
                Weekly Gathering Schedules
              </h4>
              {church.serviceTimings.length === 0 ? (
                <p style={{ color: 'var(--color-warm-gray)', fontSize: 14 }}>No service timings configured.</p>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {church.serviceTimings.map((st) => (
                    <div
                      key={st.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 14,
                        borderRadius: 12,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          padding: '8px 12px',
                          borderRadius: 10,
                          backgroundColor: 'var(--color-lavender)',
                          color: 'var(--color-primary-dark)',
                          fontWeight: 700,
                          fontSize: 13,
                          textAlign: 'center'
                        }}>
                          {st.day}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>
                            {st.serviceName}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--color-warm-gray)', display: 'flex', gap: 8, marginTop: 2 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Clock size={12} /> {st.time}
                            </span>
                            <span>•</span>
                            <span>Language: {st.language}</span>
                          </div>
                        </div>
                      </div>

                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: st.type === 'IN_PERSON' ? '#E0F2FE' : st.type === 'HYBRID' ? '#DCFCE7' : '#F3E8FF',
                        color: st.type === 'IN_PERSON' ? '#0369A1' : st.type === 'HYBRID' ? '#15803D' : '#7E22CE'
                      }}>
                        {st.type === 'IN_PERSON' ? 'In-Person' : st.type === 'HYBRID' ? 'Hybrid (Physical + Online)' : 'Online Stream'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MEDIA & CHANNELS */}
          {activeTab === 'media' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {church.isLive && (
                <div style={{
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#DC2626', fontWeight: 700, fontSize: 12 }}>
                      <Radio size={14} /> ACTIVE BROADCAST
                    </span>
                    <h5 style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>
                      {church.liveSessionTitle || 'Sunday Worship Live'}
                    </h5>
                  </div>
                  {church.media.liveStreamUrl && (
                    <a
                      href={church.media.liveStreamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: '#DC2626',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Video size={15} /> Tune In
                    </a>
                  )}
                </div>
              )}

              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-warm-gray)', textTransform: 'uppercase', marginBottom: 10 }}>
                  Official Streaming Channels
                </h4>
                <div style={{ display: 'flex', gap: 12 }}>
                  {church.media.youtubeUrl && (
                    <a
                      href={church.media.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 16px',
                        borderRadius: 10,
                        backgroundColor: '#FEE2E2',
                        color: '#991B1B',
                        fontSize: 13,
                        fontWeight: 600
                      }}
                    >
                      YouTube Channel <ExternalLink size={14} />
                    </a>
                  )}
                  {church.website && (
                    <a
                      href={church.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 16px',
                        borderRadius: 10,
                        backgroundColor: '#F1F5F9',
                        color: '#334155',
                        fontSize: 13,
                        fontWeight: 600
                      }}
                    >
                      Official Web Portal <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-warm-gray)', textTransform: 'uppercase', marginBottom: 10 }}>
                  Church Gallery &amp; Facility Photos
                </h4>
                {church.media.photos && church.media.photos.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                    {church.media.photos.map((photo, i) => (
                      <div key={i} style={{ borderRadius: 12, overflow: 'hidden', height: 130, position: 'relative' }}>
                        <img
                          src={photo}
                          alt={`${church.name} visual ${i + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    padding: 30,
                    textAlign: 'center',
                    backgroundColor: '#F9FAFB',
                    borderRadius: 12,
                    border: '1px dashed #D1D5DB'
                  }}>
                    <ImageIcon size={32} style={{ color: '#9CA3AF', margin: '0 auto 8px' }} />
                    <p style={{ fontSize: 13, color: '#6B7280' }}>No facility photos uploaded by church representative yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: VERIFICATION DOCUMENTS */}
          {activeTab === 'documents' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>
                  Submitted Legal &amp; Pastoral Credentials
                </h4>
                <span style={{ fontSize: 12, color: 'var(--color-warm-gray)' }}>
                  File contents unavailable in prototype
                </span>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {church.documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 14,
                      borderRadius: 12,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <FileText size={20} style={{ color: 'var(--color-primary)' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>
                          {doc.name}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-warm-gray)' }}>
                          {doc.fileName} • {doc.fileSize} • Selected {doc.uploadedAt}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: doc.status === 'APPROVED' ? '#DCFCE7' : doc.status === 'REJECTED' ? '#FEE2E2' : '#FEF3C7',
                        color: doc.status === 'APPROVED' ? '#15803D' : doc.status === 'REJECTED' ? '#B91C1C' : '#92400E'
                      }}>
                        {doc.status}
                      </span>
                      <button
                        onClick={() => alert('This prototype stores document names and metadata only; file contents are not available to preview.')}
                        style={{
                          background: 'none',
                          border: '1px solid #D1D5DB',
                          borderRadius: 6,
                          padding: '4px 10px',
                          fontSize: 12,
                          cursor: 'pointer'
                        }}
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div>
              <div style={{
                padding: '10px 14px',
                borderRadius: 8,
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                color: '#1E40AF',
                fontSize: 12,
                marginBottom: 16
              }}>
                ℹ️ <b>FR-CHURCH-06 Audit Trail Notice:</b> Verification decisions and registrations are tracked in the audit trail. These records demonstrate the administrative verification history in accordance with Christly Home compliance requirements.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {church.auditTrail.map((record) => (
                  <div
                    key={record.id}
                    style={{
                      borderLeft: `4px solid ${record.action === 'CHURCH_VERIFIED' ? '#10B981' : record.action === 'CHURCH_REJECTED' ? '#DC2626' : '#5B2D8E'}`,
                      padding: '10px 14px',
                      borderRadius: '0 8px 8px 0',
                      backgroundColor: '#F8FAFC'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-text)' }}>
                        {record.action.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--color-warm-gray)' }}>
                        {record.timestamp}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-warm-gray)', marginTop: 2 }}>
                      Reviewer: <b>{record.reviewer}</b> ({record.role})
                    </div>
                    {record.reason && (
                      <div style={{
                        marginTop: 6,
                        padding: '6px 10px',
                        backgroundColor: '#FEE2E2',
                        borderRadius: 6,
                        color: '#991B1B',
                        fontSize: 12
                      }}>
                        <b>Rejection Reason:</b> {record.reason}
                      </div>
                    )}
                    {record.details && (
                      <div style={{ marginTop: 4, fontSize: 12, color: '#374151' }}>
                        {record.details}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FAFAF9'
        }}>
          <div style={{ fontSize: 12, color: 'var(--color-warm-gray)' }}>
            Church ID: <code>{church.id}</code>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {church.verificationStatus === 'pending' && onApprove && (
              <button
                onClick={() => onApprove(church)}
                style={{
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  padding: '9px 18px',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Approve &amp; Verify
              </button>
            )}

            {church.verificationStatus === 'pending' && onReject && (
              <button
                onClick={() => onReject(church)}
                style={{
                  backgroundColor: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  padding: '9px 18px',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Reject Application
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#374151',
                border: '1px solid #D1D5DB',
                borderRadius: 8,
                padding: '9px 18px',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
