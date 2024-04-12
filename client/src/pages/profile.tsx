import { brandUpdate } from "@/api/brand/brand";
import { Layout } from "@/components/Layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "@/lib/context/auth/useAuth";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Profile() {
  const { user } = useAuth();
  const [brandName, setBrandName] = useState<string>("");
  const [brandUrl, setBrandUrl] = useState<string>("");
  const { getItem } = useLocalStorage();
  

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      brand_name: user?.brand_name ?? "",
      brand_url: user?.brand_url ?? "",
    },
    onSubmit: async (values) => {
      try {
        await brandUpdate(values, getItem('token')!);
        router.push("/profile");
        toast.success("Profile saved successfully.");
      } catch (error: any) {
        toast(error.message || "Something went wrong", { type: "error" });
      }
    },
  });

  useEffect(()=>{
    formik.setFieldValue("brand_name", user?.brand_name ?? "");
    formik.setFieldValue("brand_url", user?.brand_url ?? "");
  },[user]);

  return (
    <ProtectedRoute>
      <Layout title="Profile">
        <form onSubmit={formik.handleSubmit}>
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Profile Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Personal details and application.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Brand name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <input type="text" id="brand_name" className ="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required 
                    name = "brand_name" value={formik.values.brand_name} 
                    onChange={formik.handleChange}
                    // onChange={(e)=>{
                    //   setBrandName(e.target.value);
                    // }}
                  />
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Brand URL</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <input type="text" id="brand_url" className ="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required 
                      name = "brand_url" value={formik.values.brand_url} 
                      onChange={formik.handleChange}
                      // onChange={(e)=>{
                      //   setBrandUrl(e.target.value);
                      // }}
                    />
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user?.email}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="p-8">
              <button type="submit" className="border-1 bg-gray-300 p-4 hover:bg-gray-600">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </Layout>
    </ProtectedRoute>
  );
}
