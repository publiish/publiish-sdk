import React from "react";
import { useRouter } from "next/router";
import { AiOutlineUnlock } from "react-icons/ai";
import { PAGES } from "@/enum/pages";
import Link from "next/link";

const linkStyles = {
  default: "flex flex-row items-center h-10 px-3 rounded-lg text-gray-300",
  hover: "hover:bg-gray-100 hover:text-gray-700",
  active: "bg-gray-100 text-gray-700",
  inactive: "",
};

export const Sidebar: React.FC = () => {
  const router = useRouter();

  console.log("router ", router.pathname === PAGES[0].path);
  console.log(
    `flex flex-row items-center h-10 px-3 rounded-lg text-gray-700 ${
      PAGES[0].path === router.pathname ? "bg-gray-100}" : ""
    }`
  );

  return (
    <aside className="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-primary-700">
      <div className="sidebar-header flex items-center justify-center py-4">
        <div className="inline-flex">
          <Link className="inline-flex flex-row items-center" href="/dashboard">
            <span className="leading-10 text-gray-100 text-2xl font-bold ml-1 uppercase">
              PUBLIISH
            </span>
          </Link>
        </div>
      </div>
      <div className="sidebar-content px-4 py-6">
        <ul className="flex flex-col w-full">
          {PAGES.map((page) => (
            <li className="my-2">
              <Link
                href={page.path}
                className={`${linkStyles.default} ${linkStyles.hover} ${
                  linkStyles[
                    page.path === router.pathname ? "active" : "inactive"
                  ]
                }`}
              >
                {page.icon}
                <span className="ml-3">{page.name}</span>
              </Link>
            </li>
          ))}

          <li className="my-px">
            <a
              href="#"
              className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700"
            >
              <span className="flex justify-center text-lg text-red-400">
                <AiOutlineUnlock />
              </span>
              <span className="ml-3">Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};
