import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Christly Home Admin',
  description: 'Admin portal for Christly Home',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
