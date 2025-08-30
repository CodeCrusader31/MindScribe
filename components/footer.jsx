import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { assets } from '@/Assests/assets'

const Footer = () => {
  return (
    <div className="bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo and copyright */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Link href="/" className="text-xl font-bold text-white flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            MindScribe
          </Link>
          <p className="text-sm text-gray-400 text-center md:text-left">
            All rights reserved. Copyright © {new Date().getFullYear()} MindScribe
          </p>
        </div>
        
        {/* Social media icons */}
        <div className='flex gap-4'>
          <a 
            href="#" 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Facebook"
          >
            <Image src={assets.facebook_icon} alt="Facebook" width={24} height={24} />
          </a>
          <a 
            href="#" 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Twitter"
          >
            <Image src={assets.twitter_icon} alt="Twitter" width={24} height={24} />
          </a>
          <a 
            href="#" 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Google Plus"
          >
            <Image src={assets.googleplus_icon} alt="Google Plus" width={24} height={24} />
          </a>
        </div>
      </div>
      
      {/* Additional footer links */}
      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-sm text-gray-400">
          <Link href="/about" className="hover:text-white transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Footer