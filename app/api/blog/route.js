// import { ConnectDB } from "@/lib/config/db";
// import { NextResponse } from "next/server";
// import { writeFile } from "fs/promises";
// import BlogModel from "@/lib/models/BlogModel";
// import EmailModel from "@/lib/models/emailModel";
// import { sendEmail } from "@/lib/sendEmail";
// import fs from 'fs/promises';

// // Initialize database connection
// try {
//   await ConnectDB();
//   console.log("✅ Database connected successfully");
// } catch (error) {
//   console.error("❌ Database connection failed:", error);
// }

// // GET: Fetch all blogs or a single blog by ID
// export async function GET(request) {
//   try {
//     const blogId = request.nextUrl.searchParams.get("id");
    
//     if (blogId) {
//       const blog = await BlogModel.findById(blogId);
//       if (!blog) {
//         return NextResponse.json(
//           { error: "Blog not found" },
//           { status: 404 }
//         );
//       }
//       return NextResponse.json(blog);
//     }

//     const blogs = await BlogModel.find({}).sort({ createdAt: -1 });
//     return NextResponse.json({ blogs });
//   } catch (error) {
//     console.error("❌ Error fetching blogs:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch blogs" },
//       { status: 500 }
//     );
//   }
// }

// // POST: Create a new blog
// export async function POST(request) {
//   try {
//     const formData = await request.formData();
//     const timestamp = Date.now();

//     // Validate image
//     const image = formData.get("image");
//     if (!image) {
//       return NextResponse.json(
//         { error: "Image is required" },
//         { status: 400 }
//       );
//     }

//     // Process image
//     const buffer = Buffer.from(await image.arrayBuffer());
//     const imagePath = `./public/${timestamp}_${image.name}`;
//     await writeFile(imagePath, buffer);
//     const imgUrl = `/${timestamp}_${image.name}`;

//     // Validate required fields
//     const title = formData.get("title");
//     const description = formData.get("description");
//     const category = formData.get("category");
//     const author = formData.get("author");

//     if (!title || !description || !category || !author) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Create blog
//     const blogData = {
//       title,
//       description,
//       category,
//       author,
//       image: imgUrl,
//       authorImage: formData.get("authorImg"),
//       createdAt: new Date(),
//     };

//     const newBlog = await BlogModel.create(blogData);

//     // Notify subscribers
//     try {
//       const subscribers = await EmailModel.find({});
//       const recipientEmails = subscribers.map(sub => sub.email);

//       if (recipientEmails.length > 0) {
//         await sendEmail({
//           to: recipientEmails,
//           subject: `🆕 New Blog Posted: ${blogData.title}`,
//           html: `
//             <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
//               <h2 style="color: #4CAF50;">📝 ${blogData.title}</h2>
//               <p style="color: #555;">${blogData.description}</p>
//               <p style="font-size: 14px; color: #999;"><strong>Category:</strong> ${blogData.category}</p>
//               <a href="${process.env.NEXT_PUBLIC_APP_URL}/blog/${newBlog._id}" 
//                  style="display: inline-block; padding: 10px 15px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
//                 Read more
//               </a>
//             </div>
//           `,
//         });
//       }
//     } catch (emailError) {
//       console.error("❌ Error sending notification emails:", emailError);
//       // Continue execution even if email sending fails
//     }

//     return NextResponse.json(
//       { success: true, message: "Blog created successfully", blog: newBlog },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("❌ Error creating blog:", error);
//     return NextResponse.json(
//       { error: "Failed to create blog" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE: Remove a blog by ID
// export async function DELETE(request) {
//   try {
//     const id = request.nextUrl.searchParams.get('id');
//     if (!id) {
//       return NextResponse.json(
//         { error: "Blog ID is required" },
//         { status: 400 }
//       );
//     }

//     const blog = await BlogModel.findById(id);
//     if (!blog) {
//       return NextResponse.json(
//         { error: "Blog not found" },
//         { status: 404 }
//       );
//     }

//     // Delete associated image
//     try {
//       await fs.unlink(`./public${blog.image}`);
//     } catch (fileError) {
//       console.error("❌ Error deleting image file:", fileError);
//       // Continue execution even if file deletion fails
//     }

//     await BlogModel.findByIdAndDelete(id);
    
//     return NextResponse.json({
//       success: true,
//       message: "Blog deleted successfully"
//     });
//   } catch (error) {
//     console.error("❌ Error deleting blog:", error);
//     return NextResponse.json(
//       { error: "Failed to delete blog" },
//       { status: 500 }
//     );
//   }
// }

import { ConnectDB } from "@/lib/config/db";
import { NextResponse } from "next/server";
import BlogModel from "@/lib/models/BlogModel";
import EmailModel from "@/lib/models/emailModel";
import { sendEmail } from "@/lib/sendEmail";
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from "@/lib/cloudinary/utils";

// Initialize database connection
try {
  await ConnectDB();
  console.log("✅ Database connected successfully");
} catch (error) {
  console.error("❌ Database connection failed:", error);
}

// GET: Fetch all blogs or a single blog by ID
export async function GET(request) {
  try {
    const blogId = request.nextUrl.searchParams.get("id");
    const limit = parseInt(request.nextUrl.searchParams.get("limit")) || 0;
    
    if (blogId) {
      const blog = await BlogModel.findById(blogId);
      if (!blog) {
        return NextResponse.json(
          { error: "Blog not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(blog);
    }

    let query = BlogModel.find({}).sort({ createdAt: -1 });
    
    // Apply limit if specified
    if (limit > 0) {
      query = query.limit(limit);
    }
    
    const blogs = await query.exec();
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST: Create a new blog with Cloudinary upload
export async function POST(request) {
  try {
    const formData = await request.formData();

    // Validate image
    const image = formData.get("image");
    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // Convert image to buffer and upload to Cloudinary
    const buffer = Buffer.from(await image.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'mindscribe/blogs');
    
    // Validate required fields
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const author = formData.get("author");
    const authorImage = formData.get("authorImg");

    if (!title || !description || !category || !author) {
      // Delete uploaded image if validation fails
      await deleteFromCloudinary(uploadResult.public_id);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create blog
    const blogData = {
      title,
      description,
      category,
      author,
      image: uploadResult.secure_url,
      authorImage: authorImage || uploadResult.secure_url, // Fallback to main image if no author image
      createdAt: new Date(),
    };

    const newBlog = await BlogModel.create(blogData);

    // Notify subscribers
    try {
      const subscribers = await EmailModel.find({});
      const recipientEmails = subscribers.map(sub => sub.email);

      if (recipientEmails.length > 0) {
        await sendEmail({
          to: recipientEmails,
          subject: `🆕 New Blog Posted: ${blogData.title}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #4CAF50;">📝 ${blogData.title}</h2>
              <p style="color: #555;">${blogData.description}</p>
              <p style="font-size: 14px; color: #999;"><strong>Category:</strong> ${blogData.category}</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/blog/${newBlog._id}" 
                 style="display: inline-block; padding: 10px 15px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                Read more
              </a>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error("❌ Error sending notification emails:", emailError);
      // Continue execution even if email sending fails
    }

    return NextResponse.json(
      { success: true, message: "Blog created successfully", blog: newBlog },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a blog by ID and delete from Cloudinary
export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    const blog = await BlogModel.findById(id);
    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    // Delete associated image from Cloudinary
    try {
      const publicId = extractPublicId(blog.image);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    } catch (fileError) {
      console.error("❌ Error deleting image from Cloudinary:", fileError);
      // Continue execution even if file deletion fails
    }

    await BlogModel.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully"
    });
  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}