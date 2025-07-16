// pages/api/author/blogs.js

import {ConnectDB} from '@/lib/config/db'; // your DB connection logic
import BlogModel from '@/lib/models/BlogModel';


export async function GET(req) {
    try {
      await ConnectDB();
  
      const { searchParams } = new URL(req.url);
      const author = searchParams.get('author');
  
      if (!author) {
        return new Response(JSON.stringify({ msg: 'Missing author name' }), {
          status: 400,
        });
      }
  
      const blogs = await BlogModel.find({ author }).sort({ date: -1 });
  
      return new Response(JSON.stringify({ success: true, blogs }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('GET /api/author/profile ERROR:', error);
      return new Response(JSON.stringify({ msg: 'Internal Server Error' }), {
        status: 500,
      });
    }
  }

 