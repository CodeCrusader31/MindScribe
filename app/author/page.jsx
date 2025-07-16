'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { assets } from '@/Assests/assets';

const AuthorPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'author') {
        router.push('/auth/login');
      } else {
        fetchAuthorBlogs();
      }
    }
  }, [user, loading]);

  const fetchAuthorBlogs = async () => {
    try {
      const response = await axios.get(`/api/author/profile?author=${user.username}`);
      if (response.data.success) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user || user.role !== 'author') {
    return <div className="p-10 text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Author Profile Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        {/* Profile Picture */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={user.image || assets.profile_icon}
              alt={user.username}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <h1 className="text-3xl font-bold mb-2">{user.username}</h1>

          <p className="text-gray-600 mb-4">{user.bio || 'No bio available'}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {user.interests?.length > 0 ? (
              user.interests.map((interest, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {interest}
                </span>
              ))
            ) : (
              <span className="text-gray-500">No interests specified</span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{blogs.length}</span>
              <span>Blogs Published</span>
            </div>
          </div>

          <div className="flex gap-4">
            {user.socialLinks?.github && (
              <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
                <Image src={assets.github_icon} alt="GitHub" width={24} height={24} />
              </a>
            )}
            {user.socialLinks?.linkedin && (
              <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <Image src={assets.linkedin_icon} alt="LinkedIn" width={24} height={24} />
              </a>
            )}
          </div>

          
        </div>
      </div>

      {/* Blogs Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Published Blogs</h2>

        {isLoading ? (
          <div>Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="text-gray-500">No blogs published yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link key={blog._id} href={`/blogs/${blog._id}`}>
                <div className="border rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer">
                  <div className="relative h-48">
                    <Image
                      src={blog.image || assets.default_blog_image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-sm text-gray-500">{blog.category}</span>
                    <h3 className="text-lg font-semibold mt-1">{blog.title}</h3>
                    <p className="text-gray-600 mt-2 line-clamp-2">{blog.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorPage;
