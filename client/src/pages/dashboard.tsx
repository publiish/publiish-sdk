import bytes from "bytes";
import { getStats } from "@/api/brand/brand";
import { BrandStatsData } from "@/api/brand/types";
import { Layout } from "@/components/Layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "@/lib/context/auth/useAuth";
import { useEffect, useState } from "react";
import { BsFiles } from "react-icons/bs";
import { TiCloudStorageOutline } from "react-icons/ti";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<BrandStatsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      (async () => {
        setLoading(true);

        try {
          const { data } = await getStats(user.id);
          setStats(data.data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log(error);
        }
      })();
    }
  }, [user]);

  return (
    <ProtectedRoute>
      <Layout title="Dashboard">
        <>
          <h2 className="font-bold text-2xl text-gray-700 p-5">
            Your brand stats:
          </h2>
          <div className="max-w-7xl w-full mx-auto py-6">
            <div className="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4">
              <div className="w-full lg:w-1/5">
                <div className="widget w-full p-4 rounded-lg bg-white border-l-4 border-purple-400">
                  <div className="flex items-center">
                    <div className="icon w-14 p-3.5 bg-purple-400 text-white rounded-full mr-3 flex justify-center">
                      <BsFiles className="text-2xl" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-lg">
                        {!loading && stats ? stats.files_uploaded : "N/A"}
                      </div>
                      <div className="text-sm text-gray-400">
                        Files Uploaded
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/5">
                <div className="widget w-full p-4 rounded-lg bg-white border-l-4 border-blue-400">
                  <div className="flex items-center">
                    <div className="icon w-14 p-3.5 bg-blue-400 text-white rounded-full mr-3 flex justify-center">
                      <TiCloudStorageOutline className="text-2xl" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-lg">
                        {!loading && stats
                          ? bytes(stats.bytes_uploaded)
                          : "N/A"}
                      </div>
                      <div className="text-sm text-gray-400">Total size</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </Layout>
    </ProtectedRoute>
  );
}
