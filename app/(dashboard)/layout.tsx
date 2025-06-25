import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Add your dashboard navigation/header here */}
        <main className="p-4">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
} 