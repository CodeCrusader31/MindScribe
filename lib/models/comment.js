import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  blogSlug: {
    type: String,
    required: true,
  },
  commenter: {
    type: String,
    required: true,
  },
  commenterId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
