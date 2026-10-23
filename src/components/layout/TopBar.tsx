'use client';
import { Menu, Search, Bell, User } from 'lucide-react';
import styles from './TopBar.module.css';

export default function TopBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className={styles.topbar}>
      <button onClick={onToggleSidebar} className={styles.iconBtn}>
        <Menu size={24} />
      </button>
      <div className={styles.mobileBrand} aria-label="Christly Home Admin">
        <span className={styles.brandMark}>✝</span>
        <span>Christly Home</span>
      </div>
      <div className={styles.search}>
        <Search size={18} className={styles.searchIcon} />
        <input type="text" placeholder="Search..." className={styles.searchInput} />
      </div>
      <div className={styles.actions}>
        <button className={styles.iconBtn} aria-label="Notifications"><Bell size={20} /></button>
        <button className={styles.userBtn}>
          <div className={styles.avatar}><User size={18} /></div>
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
}
