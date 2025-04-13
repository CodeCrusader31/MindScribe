"use client";

import BlogTableItem from "@/components/AdminComponents/BlogTableItem";
import axios from "axios";
import React,{useState,useEffect} from "react";
import { toast } from "react-hot-toast";
const page = () => {

    const [blogs,setBlogs] = useState([]);

    const fetchBlogs = async () => {
        const response = await axios.get('/api/blog');
        setBlogs(response.data.blogs);
    }
    const deleteBlog = async (mongoId) => {
        const response = await axios.delete(`/api/blog`,{
            params:{
                id:mongoId
            }
        });
        toast.success(response.data.msg);
        fetchBlogs();
    };
    useEffect(() => {
        fetchBlogs()
    },[])


  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1>All Blogs</h1>
      <div className="relative h-[8ovh] max-w-[850px] overflow-x-auto mt-4 bordeer border-gray-400 scrrollbar-hide">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-sm text-bg-gray-700 text-left uppercase  bg-gray-50">
            <tr>
              <th scope="col" className="hidden sm:block px-6 py-3">
                Author Name
              </th>
              <th scope="col" className=" px-6 py-3">
                Blog title
              </th>
              <th scope="col" className=" px-6 py-3">
                Date
              </th>
              <th scope="col" className=" px-6 py-3">
                Action
              </th>
              
            </tr>
          </thead>
          <tbody>
  {blogs.map((item, index) => (
    <BlogTableItem key={index} mongoId = {item._id} title = {item.title} author={item.author} authorImg={item.authorImg} date={item.date} deleteBlog={deleteBlog} />
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default page;
