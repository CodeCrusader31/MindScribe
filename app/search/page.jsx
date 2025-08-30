"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        router.push('/');
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        
        const data = await response.json();
        
        // Process blogs to remove HTML tags from description
        const processedBlogs = data.blogs.map(blog => ({
          ...blog,
          // Remove HTML tags from description
          description: blog.description.replace(/<[^>]*>/g, '')
        }));
        
        setBlogs(processedBlogs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, router]);

  const handleBlogClick = (blogId) => {
    router.push(`/blogs/${blogId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for "{query}"...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Search Results for "{query}"
        </h1>
        
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No results found</h2>
            <p className="text-gray-500">Try different keywords or browse all blogs</p>
            <Link 
              href="/"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse All Blogs
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Found {blogs.length} result{blogs.length !== 1 ? 's' : ''}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div 
                  key={blog._id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleBlogClick(blog._id)}
                >
                  <img 
                    src={blog.image} 
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.description.length > 150 
                        ? `${blog.description.substring(0, 150)}...` 
                        : blog.description
                      }
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">By {blog.author}</span>
                      <span className="text-blue-600 font-medium">
                        Read more →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;