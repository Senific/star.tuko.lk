import { AdminAuthProvider } from '@/context/AdminAuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-deep-purple-900 via-[#1a0a1a] to-deep-purple-900">
        {children}
      </div>
    </AdminAuthProvider>
  );
}
