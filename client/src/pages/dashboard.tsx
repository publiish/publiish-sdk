import { Layout } from "@/components/Layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Layout title="Dashboard"></Layout>;
    </ProtectedRoute>
  );
}
