import { assets } from '@/Assests/assets'
import Image from 'next/image'
import React from 'react'

const BlogTableItem = ({authorImage,title,author,date,deleteBlog,mongoId}) => {
  const BlogDate = new Date(date);
  return (
   <tr className='bg-white border-b'>
    <th scope='row' className='item-center gap-3 hidden sm:flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
        <Image src={authorImage?authorImage:assets.profile_icon} width={60} height={50} alt=''/>
        <p className='text-sm font-semibold'>{author?author:"No author"}</p>
    </th>
    <td className='px-6 py-4'>
        {title?title:'No title'}
    </td>
    <td className='px-6 py-4' >
        {BlogDate.toDateString()}
    </td>
   
    <td onClick={()=>deleteBlog(mongoId)} className='px-6 py-4 cursor-pointer'>
      x
    </td>
    
   </tr>
  )
}

export default BlogTableItem