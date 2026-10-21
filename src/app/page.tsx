'use client';
import AdminLayout from '../components/layout/AdminLayout';
import DashboardPage from './admin/dashboard/page';

export default function Home() {
  return (
    <AdminLayout>
      <DashboardPage />
    </AdminLayout>
  );
}
