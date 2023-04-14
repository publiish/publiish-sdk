import { useAuth } from "@/lib/context/auth/useAuth";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children?: React.ReactElement;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user } = useAuth();
  console.log(user);

  return (
    <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />
      <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
        <header className="header bg-white shadow py-4 px-4">
          <div className="header-content flex items-center flex-row">
            <div className="flex ml-auto">
              <a className="flex flex-row items-center">
                <img
                  src="https://pbs.twimg.com/profile_images/378800000298815220/b567757616f720812125bfbac395ff54_normal.png"
                  className="h-10 w-10 bg-gray-200 border rounded-full"
                />
                <span className="flex flex-col ml-2">
                  <span className="truncate w-20 font-semibold tracking-wide leading-none">
                    {user?.brand_name}
                  </span>
                </span>
              </a>
            </div>
          </div>
        </header>
        <div className="main-content flex flex-col flex-grow p-4">
          <h1 className="font-bold text-2xl text-gray-700">{title}</h1>

          <div className="flex flex-col flex-grow bg-white rounded mt-4">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
