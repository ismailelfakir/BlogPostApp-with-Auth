const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  }
}, { timestamps: true });

const blogSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,  
    required: true
  },
  tags: {
    type: [String],  
    required: true
  },
  image: {
    type: String,
    required: true 
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [commentSchema]
}, { timestamps: true });

// Add a text index for searching in title and content fields
blogSchema.index({ title: 'text', content: 'text' , tags: 'text' });

module.exports = mongoose.model('Blog', blogSchema);
