import type { Metadata } from 'next';
import AdminLayoutClient from './AdminLayoutClient';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Admin | THE INKSPIRE',
  description: 'Command Center for The Inkspire Digital Magazine.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black antialiased">
        <AdminLayoutClient>
          {children}
        </AdminLayoutClient>
      </body>
    </html>
  );
}
