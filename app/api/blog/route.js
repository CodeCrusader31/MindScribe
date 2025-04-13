import { ConnectDB } from "@/lib/config/db";
import { NextResponse } from "next/server"; // ✅ Correct import
import { writeFile } from "fs/promises";
import { title } from "process";
import BlogModel from "@/lib/models/BlogModel";
import path from "path";
import { sendEmail } from "@/lib/sendEmail"; 
import EmailModel from "@/lib/models/emailModel";
const fs = require('fs');
// ✅ Use an async IIFE for database connection
(async () => {
  await ConnectDB();
})();

// Api Endpoint to get all blogs

export async function GET(request) {

  const blogId = request.nextUrl.searchParams.get("id");
  if (blogId) {
    const blog = await BlogModel.findById(blogId);
    return NextResponse.json(blog);
  }
  else{
    const blogs = await BlogModel.find({});
    return NextResponse.json({blogs});
  }
  
}
// Api Endpoint for uploading blogs
export async function POST(request) {
  try {
    await ConnectDB();

    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get("image");
    if (!image) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const imagePath = `./public/${timestamp}_${image.name}`;
    await writeFile(imagePath, buffer);
    const imgUrl = `/${timestamp}_${image.name}`;

    const blogData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      author: formData.get("author"),
      image: imgUrl,
      authorImage: formData.get("authorImg"),
    };

    await BlogModel.create(blogData);

    // 💌 Fetch subscribers and send emails
    const subscribers = await EmailModel.find({});
    const recipientEmails = subscribers.map((sub) => sub.email);

    console.log("📧 Subscribers to notify:", recipientEmails);

    await sendEmail({
      to: recipientEmails,
      subject: `🆕 New Blog Posted: ${blogData.title} just dropped!`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4CAF50;">📝 ${blogData.title}</h2>
          <p style="color: #555;">${blogData.description}</p>
          <p style="font-size: 14px; color: #999;"><strong>Category:</strong> ${blogData.category}</p>
          <a href="http://localhost:3000" style="display: inline-block; padding: 10px 15px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Read more</a>
        </div>
      `,
    });
    

    return NextResponse.json({ success: true, message: "Blog added and emails sent!" }, { status: 201 });
  } catch (error) {
    console.error("❌ Error posting blog:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get('id');
  const blog = await BlogModel.findById(id);
  fs.unlink(`./public/${blog.image}`, () => {});
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({msg:"Blog Deleted successfully"});
}
