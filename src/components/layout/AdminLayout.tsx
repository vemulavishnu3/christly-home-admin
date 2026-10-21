'use client';
import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import styles from './AdminLayout.module.css';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={sidebarOpen} />
      <div className={styles.main}>
        <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
