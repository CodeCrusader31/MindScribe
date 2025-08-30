import { assets } from '@/Assests/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
  return (
    <div className='flex flex-col bg-slate-100'>
       <div className='px-2 sm:pl-14 py-3 border border-black'>
  <div className="flex items-center">
    <svg
      className="w-6 h-6 text-blue-600"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="ml-2 text-xl font-bold text-gray-900">MindScribe</span>
  </div>
</div>
        <div className='w-28 sm:w-80 h-[100vh] relative py-12 border border-black'>
          <div className='w-[50%] sm:w-[80%] absolute right-0'>
            <Link href='/admin/addProduct' className='flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-7px_7px_0px_#000000]'>
              <Image src={assets.add_icon} alt='' width={28}/><p>Add Blogs</p>
            </Link>
            <Link href='/admin/blogList' className='mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]'>
              <Image src={assets.blog_icon} alt='' width={28}/><p>Blogs List</p>
            </Link>
            <Link href='/admin/subscription' className=' mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]'>
              <Image src={assets.email_icon} alt='' width={28}/><p>Subcriptions</p>
            </Link>
            <Link href='/admin/RegisteredUser' className=' mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]'>
              <Image src={assets.email_icon} alt='' width={28}/><p>Registered User</p>
            </Link>
            
          </div>
          

        </div>

    </div>
  )
}

export default Sidebar