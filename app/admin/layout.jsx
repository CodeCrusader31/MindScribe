import { assets } from "@/Assests/assets";
//import Sidebar from "@/components/Admin-Components/Sidebar";
import Image from "next/image";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
export default function layout({ children }) {
  return (
    <>
      <div className="flex">
        <ToastContainer theme="dark" />
        {/* <Sidebar /> */}
        <div className="flex flex-col w-full ">
          <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-12 border border-b black">
            <Link href="/admin">
              <h3 className="font-medium cursor-pointer hover:underline">
                Admin Panel
              </h3>
            </Link>
            <Image src={assets.profile_icon} width={40} alt="" />
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
