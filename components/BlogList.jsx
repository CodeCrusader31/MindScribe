import React, { useState, useEffect, useMemo } from 'react';
import BlogItem from './BlogItem';
import axios from 'axios';

const CATEGORIES = ['All', 'Technology', 'Startup', 'Lifestyle'];

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('/api/blog?limit=15');
      // If the API doesn't support limit parameter, we'll handle it client-side
      const allBlogs = response.data.blogs;
      // Get the latest 15 blogs by sorting and slicing
      const latestBlogs = allBlogs
        .sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date))
        .slice(0, 15);
      setBlogs(latestBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError('Failed to load blogs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    const filtered = blogs.filter((item) => menu === "All" ? true : item.category === menu);
    return filtered;
  }, [blogs, menu]);

  // Button component for better reusability
  const CategoryButton = ({ category }) => (
    <button
      onClick={() => setMenu(category)}
      className={`py-1 px-4 rounded-sm transition-colors duration-200 ${
        menu === category ? 'bg-black text-white' : 'hover:bg-gray-100'
      }`}
      aria-pressed={menu === category}
    >
      {category}
    </button>
  );

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>{error}</p>
        <button 
          onClick={fetchBlogs}
          className="mt-4 bg-black text-white px-4 py-2 rounded-sm hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className='flex justify-center gap-6 my-10'>
        {CATEGORIES.map((category) => (
          <CategoryButton key={category} category={category} />
        ))}
      </div>
      
      <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24'>
        {isLoading ? (
          <div className="flex items-center justify-center w-full py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            <p>No blogs found in this category.</p>
          </div>
        ) : (
          filteredBlogs.map((item) => (
            <BlogItem
              key={item._id}
              id={item._id}
              image={item.image}
              title={item.title}
              description={item.description}
              category={item.category}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BlogList;