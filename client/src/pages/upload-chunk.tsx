import DragAndDropChunkUpload from "@/components/DragAndDropChunkUpload";
import { Layout } from "@/components/Layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "@/lib/context/auth/useAuth";

export default function Upload() {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      <Layout title="File Upload">
        <div className="flex flex-col overflow-hidden bg-white shadow sm:rounded-lg items-center justify-center h-full">
          {DragAndDropChunkUpload()}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
