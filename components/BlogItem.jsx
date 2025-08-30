// import React from "react";
// import Image from "next/image";
// import Link from "next/link";

// function BlogItem({ title, description, category, image, arrow, id }) {
//   return (
//     <div className="max-w-[330px] sm:max-w-[300px] bg-white border border-black hover:shadow-[-7px_7px_0px_#000000] transition-shadow duration-200">
      
//       <Link href={`/blogs/${id}`} >
//         {image ? (
//           <Image
//             src={image}
//             alt={`${title} cover image`}
//             width={400}
//             height={400}
//             className="border-b border-black w-full h-auto"
//           />
//         ) : (
//           <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
//             <p className="text-gray-500">No Image</p>
//           </div>
//         )}
//       </Link>

//       {/* Category */}
//       <p className="ml-5 mt-5 px-1 inline-block bg-black text-white text-sm">
//         {category}
//       </p>

//       {/* Content */}
//       <div className="p-5">
//         <h5 className="mb-2 text-lg font-medium tracking-tight text-gray-900">
//           {title}
//         </h5>
//         <p className="mb-3 text-sm tracking-tight text-gray-700"
//           dangerouslySetInnerHTML={{ __html: description.slice(0,120) }} >
//         </p>

//         {/* Read More Button */}
//         <Link href={`/blogs/${id}`}>
//           <span className="inline-flex items-center py-2 font-semibold text-center cursor-pointer hover:text-blue-600 transition-colors">
//             Read More
//             {arrow ? (
//               <Image src={arrow} className="ml-2" alt="" width={12} height={20} />
//             ) : (
//               <span className="ml-2">→</span>
//             )}
//           </span>
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default BlogItem;


import React from "react";
import Image from "next/image";
import Link from "next/link";

function BlogItem({ title, description, category, image, arrow, id }) {
  // Function to remove HTML tags and truncate text
  const stripHtmlTags = (html, maxLength = 120) => {
    if (!html) return '';
    
    // Remove HTML tags
    const plainText = html.replace(/<[^>]*>/g, '');
    
    // Truncate if needed
    if (plainText.length > maxLength) {
      return plainText.substring(0, maxLength) + '...';
    }
    
    return plainText;
  };

  // Optimize Cloudinary image URL if it's from Cloudinary
  const getOptimizedImageUrl = (url) => {
    if (!url) return null;
    
    // If it's a Cloudinary URL, add optimization parameters
    if (url.includes('res.cloudinary.com')) {
      return url.replace('/upload/', '/upload/w_400,h_300,c_fill,q_auto,f_auto/');
    }
    
    return url;
  };

  const optimizedImage = getOptimizedImageUrl(image);

  return (
    <div className="max-w-[330px] sm:max-w-[300px] bg-white border border-black hover:shadow-[-7px_7px_0px_#000000] transition-shadow duration-200 rounded-lg overflow-hidden">
      
      <Link href={`/blogs/${id}`} >
        {optimizedImage ? (
          <div className="relative w-full h-48">
            <Image
              src={optimizedImage}
              alt={`${title} cover image`}
              fill
              className="object-cover border-b border-black"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center border-b border-black">
            <p className="text-gray-500">No Image</p>
          </div>
        )}
      </Link>

      {/* Category */}
      <div className="px-5 pt-5">
        <span className="px-2 py-1 bg-black text-white text-xs font-medium rounded">
          {category || 'Uncategorized'}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2 min-h-[56px]">
          {title || 'Untitled Blog'}
        </h3>
        
        <p className="mb-3 text-sm text-gray-600 line-clamp-3 min-h-[60px]">
          {stripHtmlTags(description)}
        </p>

        {/* Read More Button */}
        <Link href={`/blogs/${id}`}>
          <span className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 transition-colors group">
            Read More
            <svg 
              className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}

export default BlogItem;