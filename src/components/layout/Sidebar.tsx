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
  Settings,
  MoreHorizontal
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
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      const churches = getStoredChurches();
      setPendingCount(churches.filter(c => c.verificationStatus === 'pending').length);
    };
    updateCount();
    window.addEventListener('churches_updated', updateCount);
    return () => window.removeEventListener('churches_updated', updateCount);
  }, []);

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.sidebarClosed : ''}`}>
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

      <nav className={styles.mobileNav} aria-label="Primary navigation">
        {primaryNavItems.slice(0, 3).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`${styles.mobileNavItem} ${isActive ? styles.mobileNavActive : ''}`}
            >
              <span className={styles.mobileNavIcon}>
                <Icon size={20} />
                {item.showBadge && pendingCount > 0 && (
                  <span className={styles.mobileBadge}>{pendingCount}</span>
                )}
              </span>
              <span>{item.label === 'Church Management' ? 'Churches' : item.label === 'Church Verification' ? 'Verify' : item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          aria-expanded={moreOpen}
          aria-haspopup="menu"
          aria-current={['/admin/churches/new', '/admin/audit-logs', '/admin/users', '/admin/donations'].some(href => pathname.startsWith(href)) ? 'page' : undefined}
          onClick={() => setMoreOpen(open => !open)}
          className={`${styles.mobileNavItem} ${
            moreOpen || ['/admin/churches/new', '/admin/audit-logs', '/admin/users', '/admin/donations'].some(href => pathname.startsWith(href))
              ? styles.mobileNavActive
              : ''
          }`}
        >
          <span className={styles.mobileNavIcon}><MoreHorizontal size={20} /></span>
          <span>More</span>
        </button>
        {moreOpen && (
          <div className={styles.moreMenu} role="menu">
            {[...primaryNavItems.slice(3), ...secondaryNavItems.filter(item => item.href !== '/admin/settings')].map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setMoreOpen(false)}
                  className={styles.moreMenuItem}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </aside>
  );
}
