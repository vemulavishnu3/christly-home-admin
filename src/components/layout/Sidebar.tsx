'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Church,
  ShieldCheck,
  PlusCircle,
  ClipboardList,
  Users,
  IndianRupee,
  Settings
} from 'lucide-react';
import styles from './Sidebar.module.css';
import { getStoredChurches } from '../../data/mockChurches';

// Primary requested menu items (FR-CHURCH requirements)
const primaryNavItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { label: 'Church Management', href: '/admin/churches', icon: Church },
  { label: 'Church Verification', href: '/admin/churches/verify', icon: ShieldCheck, showBadge: true },
  { label: 'Register New Church', href: '/admin/churches/new', icon: PlusCircle },
  { label: 'Compliance Audit Logs', href: '/admin/audit-logs', icon: ClipboardList },
];

const secondaryNavItems = [
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Donations', href: '/admin/donations', icon: IndianRupee },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    const updateCount = () => {
      const churches = getStoredChurches();
      setPendingCount(churches.filter(c => c.verificationStatus === 'pending').length);
    };
    updateCount();
    window.addEventListener('churches_updated', updateCount);
    return () => window.removeEventListener('churches_updated', updateCount);
  }, []);

  if (!isOpen) return null;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: 'var(--color-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 16,
            color: 'white'
          }}>
            ✝
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.2 }}>Christly Home</div>
            <div style={{ fontSize: 11, opacity: 0.75, fontWeight: 500 }}>Admin Portal</div>
          </div>
        </div>
      </div>

      <nav className={styles.nav}>
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          color: 'rgba(255,255,255,0.45)',
          padding: '6px 14px 4px'
        }}>
          Church Administration
        </div>

        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${isActive ? styles.active : ''}`}
            >
              <Icon size={19} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.showBadge && pendingCount > 0 && (
                <span style={{
                  backgroundColor: '#D97706',
                  color: 'white',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '1px 7px'
                }}>
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}

        <div style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          color: 'rgba(255,255,255,0.45)',
          padding: '14px 14px 4px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          marginTop: 6
        }}>
          General Operations
        </div>

        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${isActive ? styles.active : ''}`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
