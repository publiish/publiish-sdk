import { AiOutlineHome, AiOutlineUser, AiOutlineCloudUpload } from "react-icons/ai";

export const PAGES = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <AiOutlineHome />,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <AiOutlineUser />,
  },
  {
    name: "Upload File (Chunk)",
    path: "/upload-chunk",
    icon: <AiOutlineCloudUpload />,
  },
  {
    name: "Upload File",
    path: "/upload",
    icon: <AiOutlineCloudUpload />,
  },
  {
    name: "ApiKey",
    path: "/apikeys",
    icon: <AiOutlineCloudUpload />,
  },
];
