"use client"
import React from 'react'
import { useState,useEffect} from 'react';

import { assets } from '@/Assests/assets';
import Image from 'next/image';
import Footer from '@/Components/Footer';
import Link from 'next/link';
import axios from 'axios';

const page = ({params}) => {

    const[data,setData] = useState(null);

    const fetchBlogData = async () =>{
       const response = await axios.get('/api/blog',{
        params:{
          id:params.id
        }
       }) 
       setData(response.data);
    }

    useEffect(() => {
      fetchBlogData();
    }, [])
    

  return (data?<>
    <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28'>
      <div className='flex justify-between items-center'>
        <Link href='/'>
        <Image className='w-[130px] sm:w-auto' src={assets.logo_light} alt='' width={180}/>
        </Link>
        <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]'>
            Get started <Image src={assets.arrow_light} alt='' width={20} height={20} />
            </button>
      </div>
      <div className='text-center my-24'>
            <h1 className='text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto'>{data.title}</h1>
            <Image src={data.authorImg} alt='' width={80} height={80} className='mx-auto mt-6'/>
            <p className='mt-1 pb-2 text-lg max-w-[740px] mx-auto'>{data.author}</p>
      </div>
    </div>
    <div className='mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10'>
        <Image className='border-4 border-white' src={data.image} width={1280} height={720} alt=''/>
        
        <div className='blog-content' dangerouslySetInnerHTML={{ __html: data.description }}></div>

         <div className='my-24'>
            <p className='text-black font-semibold my-4'>Share this article on social media</p>
            <div className='flex gap-2'>
            <Image src={assets.social_media_icon1} alt='' width={40} />
            <Image src={assets.social_media_icon2} alt='' width={40} />
            <Image src={assets.social_media_icon3} alt='' width={40} />
            </div>
        </div>
   </div>
   <Footer/>
    </>:<></>
  )
}

export default page