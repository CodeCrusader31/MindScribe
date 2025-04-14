// models/User.js
import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  years: Number,
  description: String,
}, { _id: false }); // prevents automatic _id for each subdoc

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['reader', 'author', 'admin'],
    default: 'reader',
  },
  profession: {
    type: String,
    default: '',
  },
  experiences: {
    type: [ExperienceSchema],
    default: [],
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
