// "use client";

// import BlogTableItem from "@/components/Admin-Components/BlogTableItem";
// import axios from "axios";
// import React,{useState,useEffect} from "react";
// import { toast } from "react-hot-toast";
// const page = () => {

//     const [blogs,setBlogs] = useState([]);

//     const fetchBlogs = async () => {
//         const response = await axios.get('/api/blog');
//         setBlogs(response.data.blogs);
//     }
//     const deleteBlog = async (mongoId) => {
//         const response = await axios.delete(`/api/blog`,{
//             params:{
//                 id:mongoId
//             }
//         });
//         toast.success(response.data.msg);
//         fetchBlogs();
//     };
//     useEffect(() => {
//         fetchBlogs()
//     },[])


//   return (
//     <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
//       <h1>All Blogs</h1>
//       <div className="relative h-[8ovh] max-w-[850px] overflow-x-auto mt-4 bordeer border-gray-400 scrrollbar-hide">
//         <table className="w-full text-sm text-gray-500">
//           <thead className="text-sm text-bg-gray-700 text-left uppercase  bg-gray-50">
//             <tr>
//               <th scope="col" className="hidden sm:block px-6 py-3">
//                 Author Name
//               </th>
//               <th scope="col" className=" px-6 py-3">
//                 Blog title
//               </th>
//               <th scope="col" className=" px-6 py-3">
//                 Date
//               </th>
//               <th scope="col" className=" px-6 py-3">
//                 Action
//               </th>
              
//             </tr>
//           </thead>
//           <tbody>
//   {blogs.map((item, index) => (
//     <BlogTableItem key={index} mongoId = {item._id} title = {item.title} author={item.author} authorImg={item.authorImg} date={item.date} deleteBlog={deleteBlog} />
//   ))}
// </tbody>

//         </table>
//       </div>
//     </div>
//   );
// };

// export default page;


"use client";

import BlogTableItem from "@/components/Admin-Components/BlogTableItem";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  FiSearch,
  FiPlus,
  FiRefreshCw,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle
} from "react-icons/fi";

const Page = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/blog');
      setBlogs(response.data.blogs || []);
      setFilteredBlogs(response.data.blogs || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs. Please try again.");
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (mongoId) => {
    try {
      const response = await axios.delete(`/api/blog`, {
        params: {
          id: mongoId
        }
      });
      toast.success(response.data.msg);
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
      toast.error("Failed to delete blog");
    }
  };

  // Search and filter blogs
  useEffect(() => {
    let result = blogs;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(query) || 
        blog.author.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredBlogs(result);
  }, [blogs, searchQuery, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-md">
          <FiAlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBlogs}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FiRefreshCw className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-8 sm:pl-16 pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">Manage all published blog posts</p>
        </div>
        <button className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <FiPlus className="mr-2" />
          New Blog
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100">
              <FiPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Blogs</p>
              <p className="text-2xl font-bold">{blogs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100">
              <FiFilter className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Filtered Blogs</p>
              <p className="text-2xl font-bold">{filteredBlogs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-100">
              <FiRefreshCw className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-sm font-bold">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search blogs by title or author..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={fetchBlogs}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("author")}
                >
                  <div className="flex items-center">
                    Author
                    {sortConfig.key === "author" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center">
                    Blog Title
                    {sortConfig.key === "title" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    {sortConfig.key === "date" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <BlogTableItem 
                    key={item._id} 
                    mongoId={item._id} 
                    title={item.title} 
                    author={item.author} 
                    authorImg={item.authorImg} 
                    date={item.date} 
                    deleteBlog={deleteBlog} 
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    {searchQuery ? (
                      <div className="flex flex-col items-center">
                        <FiSearch className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-gray-500">No blogs found matching "{searchQuery}"</p>
                        <button 
                          onClick={() => setSearchQuery("")}
                          className="mt-2 text-blue-600 hover:text-blue-800"
                        >
                          Clear search
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <FiPlus className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-gray-500">No blogs available</p>
                        <p className="text-gray-400 text-sm">Create your first blog post to get started</p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredBlogs.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredBlogs.length)}
              </span> of{" "}
              <span className="font-medium">{filteredBlogs.length}</span> blogs
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {number}
                </button>
              ))}
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
