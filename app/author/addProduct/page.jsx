

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { assets } from '@/Assests/assets';

const Page = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [aiTitles, setAiTitles] = useState([]);
  const [summary, setSummary] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [tags, setTags] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    title: '',
    description: '',
    category: 'Startup',
    author: '',
    authorImg: '',
  });
  

  useEffect(() => {
    if (!loading && (!user || user.role !== 'author')) {
      router.push('/auth/login');
    } else if (user) {
      setData((prevData) => ({
        ...prevData,
        author: user.username || 'Anonymous',
        authorImg: user.image || '/default-author-img.png',
      }));
    }
  }, [user, loading, router]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!data.title.trim() || !data.description.trim()) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      if (!image) {
        toast.error('Please select an image for the blog');
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('title', data.title.trim());
      formData.append('description', data.description.trim());
      formData.append('category', data.category);
      formData.append('author', data.author);
      formData.append('authorImg', data.authorImg);
      formData.append('image', image);

      const response = await axios.post('/api/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Blog created successfully!');
        
        // Reset form
        setData({
          title: '',
          description: '',
          category: 'Startup',
          author: user?.username || 'Anonymous',
          authorImg: user?.image || '/default-author-img.png',
        });
        setImage(null);
        setImagePreview(null);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(response.data.error || 'Error while creating blog');
      }

    } catch (error) {
      console.error('Error:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Something went wrong while creating the blog');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user || user.role !== 'author') {
    return null; // Will redirect due to useEffect
  }

  const generateTitles = async () => {
  if (!data.description.trim()) {
    toast.error("Please write some blog content first!");
    return;
  }

  try {
    setAiLoading(true);
    setAiTitles([]);

    const res = await fetch("/api/ai/title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: data.description }),
    });

    const result = await res.json();

    if (result.success && result.titles?.length) {
      setAiTitles(result.titles); // titles is now [{title, type}, ...]
    } else {
      toast.error("Could not generate titles. Try again.");
    }
  } catch (error) {
    console.error(error);
    toast.error("AI service unavailable.");
    } finally {
      setAiLoading(false);
    }
  };

  const generateSummary = async () => {
    if (!data.description.trim()) {
      toast.error("Please write some blog content first!");
      return;
    }

    try {
      setIsSummarizing(true);
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: data.description }),
      });

      const result = await res.json();

      if (result.success && result.summary) {
        setSummary(result.summary);
        toast.success("Summary generated!");
      } else {
        toast.error("Could not generate summary. Try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("AI service unavailable.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const improveContent = async () => {
    if (!data.description.trim()) {
      toast.error("Please write some blog content first!");
      return;
    }

    try {
      setIsImproving(true);
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: data.description }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let improvedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        improvedText += chunk;
        
        setData((prev) => ({ ...prev, description: improvedText }));
      }
      
      toast.success("Content improved!");

    } catch (error) {
      console.error(error);
      toast.error("AI service unavailable.");
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Blog Post</h1>
        
        <form onSubmit={onSubmitHandler} className="bg-white rounded-lg shadow-md p-6">
          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Thumbnail *
            </label>
            <div className="flex flex-col items-start gap-4">
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 w-full max-w-xs">
                <label htmlFor="image" className="cursor-pointer">
                  <Image
                    src={imagePreview || assets.upload_area}
                    alt="Blog thumbnail"
                    width={200}
                    height={120}
                    className="object-cover mx-auto"
                  />
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Click to upload thumbnail
                  </p>
                </label>
                <input
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  type="file"
                  id="image"
                  accept="image/*"
                  className="hidden"
                  required
                />
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500">Supported formats: JPEG, PNG, WebP. Max size: 5MB</p>
            </div>
          </div>

          {/* Title Field */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title *
            </label>
            <input
              name="title"
              onChange={onChangeHandler}
              value={data.title}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="text"
              placeholder="Enter blog title"
              required
            />
            <button
  type="button"
  onClick={generateTitles}
  disabled={aiLoading || !data.description.trim()}
  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
>
  {aiLoading ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
      Generating...
    </>
  ) : (
    "✨ Generate AI Titles"
  )}
</button>

{aiTitles.length > 0 && (
  <div className="mt-3 space-y-2">
    <p className="text-xs text-gray-500 font-medium">Click a title to use it:</p>
    {aiTitles.map((item, index) => (
      <div
        key={index}
        onClick={() => setData({ ...data, title: item.title })}
        className="cursor-pointer bg-gray-50 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 p-3 rounded-md transition-colors"
      >
        <span className="text-sm font-medium text-gray-800">{item.title}</span>
        <span className="ml-2 text-xs text-blue-500 capitalize bg-blue-100 px-2 py-0.5 rounded-full">
          {item.type}
        </span>
      </div>
    ))}
  </div>
)}
          </div>

          {/* Description Field */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Blog Content *
            </label>
            <textarea
              name="description"
              onChange={onChangeHandler}
              value={data.description}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your blog content here..."
              rows={8}
              required
            />
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={improveContent}
                disabled={isImproving || !data.description.trim()}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isImproving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Improving...
                  </>
                ) : (
                  "🪄 Improve Content"
                )}
              </button>
              <button
                type="button"
                onClick={generateSummary}
                disabled={isSummarizing || !data.description.trim()}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isSummarizing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Summarizing...
                  </>
                ) : (
                  "📝 Generate Summary"
                )}
              </button>
            </div>

            {summary && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <h3 className="font-semibold text-gray-800 mb-2">AI Summary</h3>
                <p className="text-sm text-gray-600 mb-2"><strong>Short:</strong> {summary.short_summary}</p>
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Key Points:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    {summary.bullet_points?.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                </div>
                <p className="text-sm text-gray-600"><strong>Social Media Post:</strong> {summary.social_media_post}</p>
              </div>
            )}
          </div>

          {/* Category Field */}
          <div className="mb-8">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              onChange={onChangeHandler}
              value={data.category}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Startup">StartUp</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          {/* Author Info (hidden but included in form) */}
          <input type="hidden" name="author" value={data.author} />
          <input type="hidden" name="authorImg" value={data.authorImg} />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Blog...
              </div>
            ) : (
              'PUBLISH BLOG'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;