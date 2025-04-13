import React from "react";
import Image from "next/image";
import Link from "next/link";

function BlogItem({ title, description, category, image, arrow, id }) {
  return (
    <div className="max-w-[330px] sm:max-w-[300px] bg-white border border-black hover:shadow-[-7px_7px_0px_#000000] transition-shadow duration-200">
      
      <Link href={`/blogs/${id}`} >
        {image ? (
          <Image
            src={image}
            alt={`${title} cover image`}
            width={400}
            height={400}
            className="border-b border-black w-full h-auto"
          />
        ) : (
          <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No Image</p>
          </div>
        )}
      </Link>

      {/* Category */}
      <p className="ml-5 mt-5 px-1 inline-block bg-black text-white text-sm">
        {category}
      </p>

      {/* Content */}
      <div className="p-5">
        <h5 className="mb-2 text-lg font-medium tracking-tight text-gray-900">
          {title}
        </h5>
        <p className="mb-3 text-sm tracking-tight text-gray-700"
          dangerouslySetInnerHTML={{ __html: description.slice(0,120) }} >
        </p>

        {/* Read More Button */}
        <Link href={`/blogs/${id}`}>
          <span className="inline-flex items-center py-2 font-semibold text-center cursor-pointer hover:text-blue-600 transition-colors">
            Read More
            {arrow ? (
              <Image src={arrow} className="ml-2" alt="" width={12} height={20} />
            ) : (
              <span className="ml-2">→</span>
            )}
          </span>
        </Link>
      </div>
    </div>
  );
}

export default BlogItem;
