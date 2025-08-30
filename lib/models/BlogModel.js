


// import mongoose from "mongoose"; 

// const Schema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//         index: true // Add index for better search performance
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     category:{
//         type: String,
//         required: true
//     },
//     author:{
//         type: String,
//         required: true,
//         index: true // Add index for better search performance
//     },
//     image: {
//         type: String,
//         required: true
//     },
//     authorImage: {
//         type: String,
//         required: true
//     },
//     createdAt:{
//         type: Date,
//         default: Date.now
//     }
// })

// // Create text index for search functionality
// Schema.index({ title: 'text', author: 'text' });

// const BlogModel = mongoose.models.blog || mongoose.model('blog', Schema);

// export default BlogModel;

import mongoose from "mongoose"; 

const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true,
        index: true
    },
    image: {
        type: String,
        required: true
    },
    authorImage: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

// Create text index for search functionality
Schema.index({ title: 'text', author: 'text' });

const BlogModel = mongoose.models.blog || mongoose.model('blog', Schema);

export default BlogModel;