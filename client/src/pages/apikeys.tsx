import { createApiKey, getApiKeys } from "@/api/apikey/apikey";
import { brandUpdate } from "@/api/brand/brand";
import { Layout } from "@/components/Layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "@/lib/context/auth/useAuth";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Apikeys() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const { getItem } = useLocalStorage();
  
  const router = useRouter();

  const createApiKeyHandler = async () => {
    try {
      await createApiKey( {
          isDefault: "false",
          storageSize: "0",
          expireAt: (new Date()).toISOString(),
          writePermission: "true",
          deletePermission: "true"
        }, 
        getItem('token')!
      );
      
      router.push("/apikeys");
      toast.success("ApiKey created successfully.");

    } catch (error: any) {
      toast(error.message || "Something went wrong", { type: "error" });
    }
  }

  useEffect(()=>{
    if (user) {
      (async () => {

        try {
          const { data } = await getApiKeys(getItem('token')!);
          setApiKeys(data.data);
        } catch (error: any) {
          toast(error.message || "Something went wrong", { type: "error" });
          console.log(error);
        }
      })();
    }
  },[user]);

  return (
    <ProtectedRoute>
      <Layout title="Profile">
        <form>
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Apikey Management
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Create or remove Apikeys.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                {apiKeys.map((item, index)=>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6" key={index}>
                    <dt className="text-sm font-medium text-gray-500">
                      { index + 1 }
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      { item.apikey }
                    </dd>
                </div>
                )}
                
              </dl>
            </div>
            <div className="p-8">
              <button type="button" className="border-1 bg-gray-300 p-4 hover:bg-gray-600"
                onClick={createApiKeyHandler}
              >
                Create ApiKey
              </button>
            </div>
          </div>
        </form>
      </Layout>
    </ProtectedRoute>
  );
}
