'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Church, ShieldCheck, PlusCircle, ClipboardList, ArrowRight, Radio, Users } from 'lucide-react';
import { getStoredChurches } from '../../../data/mockChurches';
import VerifiedBadge from '../../../components/churches/VerifiedBadge';

export default function DashboardPage() {
  const [churches, setChurches] = useState<any[]>([]);

  useEffect(() => {
    const list = getStoredChurches();
    setChurches(list);
  }, []);

  const verifiedCount = churches.filter(c => c.verificationStatus === 'approved').length;
  const pendingCount = churches.filter(c => c.verificationStatus === 'pending').length;
  const liveCount = churches.filter(c => c.isLive).length;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 40 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
          Admin Dashboard
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-warm-gray)', marginTop: 4 }}>
          Christly Home FaithTech Platform Overview &amp; Church Operations Hub
        </p>
      </div>

      {/* Primary KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
        {[
          { label: 'Total Platform Users', value: '12,847', color: 'var(--color-primary)', href: '/admin/users' },
          { label: 'Verified Churches', value: verifiedCount, color: 'var(--color-secondary)', href: '/admin/churches' },
          { label: 'Live Sessions', value: liveCount, color: '#10B981', href: '/admin/churches' },
          { label: 'Total Donations', value: '₹18,42,500', color: '#3B82F6', href: '/admin/donations' },
        ].map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            style={{
              background: 'white',
              padding: 22,
              borderRadius: 16,
              borderLeft: `5px solid ${stat.color}`,
              boxShadow: 'var(--shadow-card)',
              textDecoration: 'none',
              display: 'block',
              transition: 'transform 0.15s ease'
            }}
          >
            <p style={{ color: 'var(--color-warm-gray)', fontSize: 13, marginBottom: 6 }}>{stat.label}</p>
            <h3 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text)' }}>{stat.value}</h3>
          </Link>
        ))}
      </div>

      {/* Quick Access to Church Discovery & Verification Modules */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-border)',
        marginBottom: 28
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
              FR-CHURCH Operations Hub
            </h2>
            <p style={{ fontSize: 13, color: 'var(--color-warm-gray)', marginTop: 2 }}>
              Quick navigation for Church Discovery, Onboarding, Verification, and Audit Logging
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
          {/* Card 1: Church Discovery */}
          <Link
            href="/admin/churches"
            style={{
              padding: 18,
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              backgroundColor: '#FAFAF9',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: 'var(--color-lavender)',
                color: 'var(--color-primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}>
                <Church size={20} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                Church Management
              </h3>
              <p style={{ fontSize: 12, color: 'var(--color-warm-gray)', marginTop: 4 }}>
                Search, filter by denomination/distance/live status, and toggle List/Map views.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', marginTop: 14 }}>
              Open Directory <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 2: Church Verification */}
          <Link
            href="/admin/churches/verify"
            style={{
              padding: 18,
              borderRadius: 12,
              border: '1px solid #FDE68A',
              backgroundColor: '#FFFBEB',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}>
                <ShieldCheck size={20} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                  Verification Queue
                </h3>
                {pendingCount > 0 && (
                  <span style={{ backgroundColor: '#D97706', color: 'white', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 800 }}>
                    {pendingCount}
                  </span>
                )}
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-warm-gray)', marginTop: 4 }}>
                Review credentials, inspect documents, and Approve or Reject with feedback.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#B45309', marginTop: 14 }}>
              Review Applications <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 3: Register New Church */}
          <Link
            href="/admin/churches/new"
            style={{
              padding: 18,
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              backgroundColor: '#FAFAF9',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}>
                <PlusCircle size={20} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                Register New Church
              </h3>
              <p style={{ fontSize: 12, color: 'var(--color-warm-gray)', marginTop: 4 }}>
                Onboard new church assemblies with validated forms and document uploads.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#15803D', marginTop: 14 }}>
              Open Registration <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 4: Compliance Audit Logs */}
          <Link
            href="/admin/audit-logs"
            style={{
              padding: 18,
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              backgroundColor: '#FAFAF9',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#E0E7FF',
                color: '#4338CA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}>
                <ClipboardList size={20} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                Compliance Audit Logs
              </h3>
              <p style={{ fontSize: 12, color: 'var(--color-warm-gray)', marginTop: 4 }}>
                Review complete timestamped audit trails of administrative decisions.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#4338CA', marginTop: 14 }}>
              Inspect Logs <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </div>

      {/* Verified Churches Quick Preview */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            Featured Verified Churches
          </h2>
          <Link
            href="/admin/churches"
            style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}
          >
            View All ({churches.length}) →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {churches.filter(c => c.verificationStatus === 'approved').slice(0, 3).map(c => (
            <div
              key={c.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 14,
                borderRadius: 12,
                border: '1px solid #E5E7EB',
                backgroundColor: '#FAFAF9'
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: c.avatarBg,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 16,
                flexShrink: 0
              }}>
                {c.avatarInitials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.name}
                  </span>
                  <VerifiedBadge church={c} size="sm" />
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-warm-gray)', marginTop: 2 }}>
                  {c.denomination} • {c.city}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
