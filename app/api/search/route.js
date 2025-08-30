import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await ConnectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }
    
    // Search for blogs where title or author contains the query (case insensitive)
    const blogs = await BlogModel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    // Return the blogs with proper IDs
    const blogData = blogs.map(blog => ({
      _id: blog._id.toString(),
      title: blog.title,
      description: blog.description,
      category: blog.category,
      author: blog.author,
      image: blog.image,
      authorImage: blog.authorImage,
      createdAt: blog.createdAt
    }));
    
    return NextResponse.json({ blogs: blogData });
  } catch (error) {
    console.error("❌ Error searching blogs:", error);
    return NextResponse.json(
      { error: "Failed to search blogs" },
      { status: 500 }
    );
  }
}