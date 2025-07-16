"use client";
import Headers from "@/components/Header";
import Footer from "@/components/Footer";
import BlogList from "@/components/BlogList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Home() {
  return (
    <>
    <ToastContainer theme="dark"/>
    <Headers/>
    <BlogList/>
    <Footer/>

    
    </>
  );
}
