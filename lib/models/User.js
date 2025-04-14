import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    lowercase: true,
    minLength: [3, "Username must be at least 3 characters long"],
    maxLength: [30, "Username cannot exceed 30 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [6, "Password must be at least 6 characters long"]
  },
  role: {
    type: String,
    enum: ["reader", "author", "admin"],
    default: "reader"
  },
  profession: {
    type: String,
    default: ""
  },
  // Fixed: Changed experiences to be an array of strings
  experiences: {
    type: [String], // This is the correct way to define an array of strings
    default: [],
    validate: {
      validator: function(v) {
        // Ensure each experience is a string and not empty
        return Array.isArray(v) && v.every(exp => typeof exp === 'string' && exp.trim().length > 0);
      },
      message: 'Experiences must be an array of non-empty strings'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;