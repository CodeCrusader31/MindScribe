'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Import your Auth context
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { assets } from '@/Assests/assets';

const Page = () => {
  const { user, loading } = useAuth(); // Get user data from Auth context
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    title: '',
    description: '',
    category: 'Startup',
    author: '',  // This will be set to the logged-in user's name
    authorImg: '', // This will be set to the logged-in user's image
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'author')) {
      router.push('/auth/login'); // Redirect if user is not logged in or role is not author
    } else if (user) {
      // Set the author's name and image based on the logged-in user
      setData((prevData) => ({
        ...prevData,
        author: user.username || 'Anonymous',  // Default to 'Anonymous' if no name is available
        authorImg: user.image || '/default-author-img.png', // Default to a placeholder image if no image exists
      }));
    }
  }, [user, loading, router]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('author', data.author); // Author name from user context
      formData.append('authorImg', data.authorImg); // Author image from user context
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post('/api/blog', formData);

      if (response.data.success) {
        toast.success(response.data.msg || 'Blog added successfully!');
        setImage(null);
        setData({
          title: '',
          description: '',
          category: 'Startup',
          author: user.username || 'Anonymous', // Reset to the logged-in user's name
          authorImg: user.image || '/default-author-img.png', // Reset the image to the logged-in user's image
        });
      } else {
        toast.error('Error while adding blog');
      }

      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    }
  };

  if (loading || !user || user.role !== 'author') {
    return <p className="p-10">Loading...</p>; // or a spinner
  }

  return (
    <form onSubmit={onSubmitHandler} className="pt-5 px-5 sm:pt-12 sm:pl-16">
      <p className="text-xl">Upload Thumbnail</p>
      <label htmlFor="image">
        <Image
          className="mt-4"
          src={image ? URL.createObjectURL(image) : assets.upload_area}
          alt="Upload Thumbnail"
          width={140}
          height={70}
        />
      </label>
      <input
        onChange={(e) => setImage(e.target.files[0])}
        type="file"
        id="image"
        hidden
        required
      />

      <p className="text-ml mt-4">Blog Title</p>
      <input
        name="title"
        onChange={onChangeHandler}
        value={data.title}
        className="w-full sm:w-[500px] mt-4 px-4 py-3 border"
        type="text"
        placeholder="Type here"
        required
      />

      <p className="text-ml mt-4">Blog Description</p>
      <textarea
        name="description"
        onChange={onChangeHandler}
        value={data.description}
        className="w-full sm:w-[500px] mt-4 px-4 py-3 border"
        placeholder="Write content here"
        required
      />

      <p className="text-ml mt-4">Blog Category</p>
      <select
        name="category"
        onChange={onChangeHandler}
        value={data.category}
        className="w-40 mt-4 px-4 py-3 border text-gray-500"
      >
        <option value="Startup">StartUp</option>
        <option value="Technology">Technology</option>
        <option value="Lifestyle">Lifestyle</option>
      </select>

      <button type="submit" className="mt-8 w-40 h-12 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Page;
