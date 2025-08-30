// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import axios from 'axios';
// import Image from 'next/image';
// import Link from 'next/link';
// import { assets } from '@/Assests/assets';

// const AuthorPage = () => {
//   const { user, loading } = useAuth();
//   const router = useRouter();
//   const [blogs, setBlogs] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (!loading) {
//       if (!user || user.role !== 'author') {
//         router.push('/auth/login');
//       } else {
//         fetchAuthorBlogs();
//       }
//     }
//   }, [user, loading]);

//   const fetchAuthorBlogs = async () => {
//     try {
//       const response = await axios.get(`/api/author/profile?author=${user.username}`);
//       if (response.data.success) {
//         setBlogs(response.data.blogs);
//       }
//     } catch (error) {
//       console.error('Error fetching blogs:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (loading || !user || user.role !== 'author') {
//     return <div className="p-10 text-center text-gray-600">Loading...</div>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       {/* Author Profile Section */}
//       <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
//         {/* Profile Picture */}
//         <div className="w-full md:w-1/3 lg:w-1/4">
//           <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
//             <Image
//               src={user.image || assets.profile_icon}
//               alt={user.username}
//               fill
//               className="object-cover"
//             />
//           </div>
//         </div>

//         {/* Profile Info */}
//         <div className="w-full md:w-2/3 lg:w-3/4">
//           <h1 className="text-3xl font-bold mb-2">{user.username}</h1>

//           <p className="text-gray-600 mb-4">{user.bio || 'No bio available'}</p>

//           <div className="flex flex-wrap gap-2 mb-6">
//             {user.interests?.length > 0 ? (
//               user.interests.map((interest, index) => (
//                 <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
//                   {interest}
//                 </span>
//               ))
//             ) : (
//               <span className="text-gray-500">No interests specified</span>
//             )}
//           </div>

//           <div className="flex items-center gap-4 mb-6">
//             <div className="flex items-center gap-2">
//               <span className="font-semibold">{blogs.length}</span>
//               <span>Blogs Published</span>
//             </div>
//           </div>

//           <div className="flex gap-4">
//             {user.socialLinks?.github && (
//               <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
//                 <Image src={assets.github_icon} alt="GitHub" width={24} height={24} />
//               </a>
//             )}
//             {user.socialLinks?.linkedin && (
//               <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
//                 <Image src={assets.linkedin_icon} alt="LinkedIn" width={24} height={24} />
//               </a>
//             )}
//           </div>

          
//         </div>
//       </div>

//       {/* Blogs Section */}
//       <div className="mb-12">
//         <h2 className="text-2xl font-bold mb-6">Published Blogs</h2>

//         {isLoading ? (
//           <div>Loading blogs...</div>
//         ) : blogs.length === 0 ? (
//           <div className="text-gray-500">No blogs published yet</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {blogs.map((blog) => (
//               <Link key={blog._id} href={`/blogs/${blog._id}`}>
//                 <div className="border rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer">
//                   <div className="relative h-48">
//                     <Image
//                       src={blog.image || assets.default_blog_image}
//                       alt={blog.title}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <div className="p-4">
//                     <span className="text-sm text-gray-500">{blog.category}</span>
//                     <h3 className="text-lg font-semibold mt-1">{blog.title}</h3>
//                     <p className="text-gray-600 mt-2 line-clamp-2">{blog.description}</p>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthorPage;
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
  const [activeTab, setActiveTab] = useState('published');

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

  const handleEditProfile = () => {
    router.push('/author/edit');
  };

  const handleCreateBlog = () => {
    router.push('/author/addProduct');
  };

  if (loading || !user || user.role !== 'author') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with action buttons */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Author Dashboard</h1>
        <div className="flex gap-4">
          <button 
            onClick={handleEditProfile}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Profile
          </button>
          <button 
            onClick={handleCreateBlog}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Blog
          </button>
        </div>
      </div>

      {/* Author Profile Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Profile Picture */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col items-center">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={user.image || assets.profile_icon}
                alt={user.username}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex flex-col items-center">
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                <span className="font-semibold text-blue-700">{blogs.length}</span>
                <span className="text-sm text-blue-600">Blogs Published</span>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Author
              </span>
            </div>

            <p className="text-gray-600 mb-6 text-lg">{user.bio || 'No bio available'}</p>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests?.length > 0 ? (
                  user.interests.map((interest, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {interest}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No interests specified</span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Social Links</h3>
              <div className="flex gap-4">
                {user.socialLinks?.github && (
                  <a 
                    href={user.socialLinks.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Image src={assets.github_icon} alt="GitHub" width={24} height={24} />
                  </a>
                )}
                {user.socialLinks?.linkedin && (
                  <a 
                    href={user.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Image src={assets.linkedin_icon} alt="LinkedIn" width={24} height={24} />
                  </a>
                )}
                {(!user.socialLinks?.github && !user.socialLinks?.linkedin) && (
                  <span className="text-gray-500">No social links added</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blogs Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Blogs</h2>
          
          <div className="flex border border-gray-200 rounded-lg p-1">
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'published' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('published')}
            >
              Published
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'drafts' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('drafts')}
            >
              Drafts
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs published yet</h3>
            <p className="text-gray-500 mb-4">Start sharing your ideas with the world</p>
            <button 
              onClick={handleCreateBlog}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Blog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
                <Link href={`/blogs/${blog._id}`}>
                  <div className="relative h-48">
                    <Image
                      src={blog.image || assets.default_blog_image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {blog.category}
                  </span>
                  <Link href={`/blogs/${blog._id}`}>
                    <h3 className="text-lg font-semibold mt-2 hover:text-blue-600 transition-colors cursor-pointer">{blog.title}</h3>
                  </Link>
                  <p className="text-gray-600 mt-2 line-clamp-2 text-sm">{blog.description}</p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorPage;