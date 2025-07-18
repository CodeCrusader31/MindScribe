import React, { use } from 'react'
import Image from 'next/image'
import { assets } from '@/Assests/assets'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useState } from 'react'

const Header = () => {

  const[email,setEmail] = useState("");

  const onSubmitHandler = async (e) =>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("email",email);
    const response = await axios.post('/api/email',formData);
    if(response.data.success){
      toast.success(response.data.msg);
      setEmail("");
    }
    else{
      toast.error("Error")
    }
  }

  return (
    <div className="py-2 px-5 md:px-12 lg:px-28">
      <div className="flex justify-between items-center">
        {/*<Image src={assets.logo1} width={130} alt='' className="w-[80px] sm:w-auto" />*/}
        <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000000]'>Get started <Image src={assets.arrow} width={20} height={20} alt="Arrow" />
        </button>
      </div>
      <div className='text-center my-8'>
        <h1 className='text-3xl sm:text-5xl font-medium'>Ink & Ideas</h1>
        <p className='mt-10 max-w-[740px] m-auto text-xs sm:text-base'>Discover the latest trends in technology and how they impact our daily lives. Join us as we delve into insightful articles and expert opinions.</p>
        <form onSubmit={onSubmitHandler} className='flex justify-between max-w-[500px] scale-75 sm:scale-100 mx-auto mt-10 border border-black shadow-[-7px_7px_0px_#000000]' action="">
            <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="Enter your email" className='pl-4 outline-none'/>
            <button type='submit' className='border-l border-black py-4 px-4 sm:px-8 active:bg-gray-600 active:text-white'>Subscribe</button>
        </form>
        </div>
    </div>
  )
}

export default Header