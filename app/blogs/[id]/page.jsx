"use client";

import React, { useState, useEffect } from "react";
import { assets } from "@/Assests/assets";
import Image from "next/image";
import Footer from "@/Components/footer";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const blogId = params.id;
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBlogData = async () => {
    try {
      const response = await axios.get("/api/blog", {
        params: { id: blogId },
      });
      setData(response.data);
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("Failed to load blog post");
    } finally {
      setLoading(false);
    }
  };
  

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments/${blogId}`);
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!user) {
      setError("You must be logged in to comment");
      return;
    }
  
    if (!commentText.trim()) {
      setError("Comment cannot be empty");
      return;
    }
  
    try {
      console.log("Submitting comment with data:", {
        blogSlug: blogId,
        commenter: user?.username,
       // commenterId: user?.id,
        text: commentText,
      });
    
      const res = await axios.post("/api/comments/comment", {
        blogSlug: blogId,
        commenter: user?.username,
        //commenterId: user?.id,
        text: commentText,
      });
    
      if (res.data.success) {
        setCommentText("");
        await fetchComments(); // Refresh comments
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError("Failed to submit comment. Please try again.");
    }
    
  };
  

  useEffect(() => {
    if (blogId) {
      fetchBlogData();
      fetchComments();
    }
  }, [blogId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{error || "Blog post not found"}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-200 py-5 px-5 md:px-12 lg:px-28">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image
              className="w-[130px] sm:w-auto"
              src={assets.logo_light}
              alt="Logo"
              width={180}
            />
          </Link>
          <button className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]">
            Get started{" "}
            {assets.arrow_light && (
  <Image
    src={assets.arrow_light}
    alt="Arrow"
    width={20}
    height={20}
  />
)}
          </button>
        </div>

        <div className="text-center my-24">
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">
            {data.title}
          </h1>
          {data.authorImg && (
  <Image
    src={data.authorImg}
    alt={data.author || "Author Image"}
    width={80}
    height={80}
    className="mx-auto mt-6 rounded-full"
  />
)}

          <p className="mt-1 pb-2 text-lg max-w-[740px] mx-auto">{data.author}</p>
        </div>
      </div>

      <div className="mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10">
        <Image
          className="border-4 border-white rounded-lg"
          src={data.image}
          width={1280}
          height={720}
          alt={data.title}
          priority
        />

        <div
          className="blog-content mt-8 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>

        <div className="my-24">
          <p className="text-black font-semibold my-4">
            Share this article on social media
          </p>
          <div className="flex gap-2">
          {assets.social_media_icon1 && (
  <Image src={assets.social_media_icon1} alt="Twitter" width={40} />
)}

{assets.social_media_icon2 && (
  <Image src={assets.social_media_icon2} alt="Facebook" width={40} />
)}

{assets.social_media_icon3 && (
  <Image src={assets.social_media_icon3} alt="LinkedIn" width={40} />
)}

          </div>
        </div>
      </div>

      <div className="my-12 max-w-[800px] md:mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">
          Comments ({comments.length})
        </h2>

        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              rows={4}
              required
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
            <button
              type="submit"
              className="mt-2 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              disabled={!commentText.trim()}
            >
              Submit Comment
            </button>
          </form>
        ) : (
          <div className="mb-6 p-4 bg-yellow-100 rounded-md">
            <p>
              You must be{" "}
              <Link
                href="/login"
                className="text-blue-600 underline hover:text-blue-800"
              >
                logged in
              </Link>{" "}
              to post comments.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="p-4 bg-gray-50 rounded-md border"
              >
                <p className="font-medium text-gray-900">{comment.commenter}</p>
                <p className="mt-1 text-gray-700">{comment.text}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Page;
