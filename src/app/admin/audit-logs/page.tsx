'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AuditRecord } from '../../../types/church';
import { getAllAuditRecords } from '../../../data/mockChurches';
import {
  ClipboardList,
  Search,
  Filter,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Building,
  RotateCcw,
  Info
} from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const loadLogs = () => {
    const records = getAllAuditRecords();
    setLogs(records);
  };

  useEffect(() => {
    loadLogs();
    const handleUpdate = () => loadLogs();
    window.addEventListener('churches_updated', handleUpdate);
    return () => window.removeEventListener('churches_updated', handleUpdate);
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (actionFilter !== 'ALL' && log.action !== actionFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          log.churchName.toLowerCase().includes(q) ||
          log.reviewer.toLowerCase().includes(q) ||
          (log.reason && log.reason.toLowerCase().includes(q)) ||
          (log.details && log.details.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [logs, actionFilter, searchQuery]);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>
      {/* Header */}
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
            Audit Logs &amp; Administrative History
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-warm-gray)', marginTop: 4 }}>
            System record of church onboarding, verification decisions, and rejection feedback in accordance with FR-CHURCH-06.
          </p>
        </div>

        <Link
          href="/admin/churches/verify"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          <ShieldCheck size={16} />
          Go to Verification Queue
        </Link>
      </div>

      {/* Compliance Notice Banner */}
      <div style={{
        padding: '12px 16px',
        borderRadius: 10,
        backgroundColor: '#EFF6FF',
        border: '1px solid #BFDBFE',
        color: '#1E40AF',
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20
      }}>
        <Info size={18} style={{ flexShrink: 0 }} />
        <span>
          <b>FR-CHURCH-06 Audit Logging:</b> All church approval and rejection records, reviewer IDs, timestamps, and justifications are tracked here. In accordance with prototype requirements, records are session-managed until persistent database integration is activated.
        </span>
      </div>

      {/* Main Table Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-border)'
      }}>
        {/* Search & Filter Toolbar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 220px auto',
          gap: 12,
          marginBottom: 20
        }} className="audit-filter-toolbar">
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF'
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by church, reviewer, or keyword..."
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                fontSize: 13,
                backgroundColor: '#FAFAF9'
              }}
            />
          </div>

          <div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                fontSize: 13,
                backgroundColor: '#FAFAF9'
              }}
            >
              <option value="ALL">All Actions</option>
              <option value="CHURCH_VERIFIED">Church Verified</option>
              <option value="CHURCH_REJECTED">Church Rejected</option>
              <option value="CHURCH_REGISTERED">Church Registered</option>
            </select>
          </div>

          {(searchQuery || actionFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActionFilter('ALL');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                color: 'var(--color-warm-gray)',
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
              Reset
            </button>
          )}
        </div>

        {/* Audit Log Entries List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredLogs.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-warm-gray)', fontSize: 14 }}>
              No audit records matching your criteria.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isApproval = log.action === 'CHURCH_VERIFIED';
              const isRejection = log.action === 'CHURCH_REJECTED';
              const borderLeftColor = isApproval ? '#10B981' : isRejection ? '#DC2626' : '#5B2D8E';
              const badgeBg = isApproval ? '#DCFCE7' : isRejection ? '#FEE2E2' : '#F3E8FF';
              const badgeText = isApproval ? '#15803D' : isRejection ? '#B91C1C' : '#6B21A8';

              return (
                <div
                  key={log.id}
                  className="audit-log-entry"
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
                      <div className="audit-log-title-row" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{
                          backgroundColor: badgeBg,
                          color: badgeText,
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
            })
          )}
        </div>
      </div>
    </div>
  );
}
