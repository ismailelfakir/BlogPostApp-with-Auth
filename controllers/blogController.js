const Blog = require('../models/Blog');
const User = require('../models/User');

const getHomePage = async (req, res) => {
  try {
    let query = {}; // Initialize an empty query object

    // Check if a category parameter is provided
    if (req.query.category) {
      // If a category parameter is provided, add it to the query
      query.category = req.query.category;
    }

    const allBlogs = await Blog.find(query);
    const user = req.isAuthenticated() ? req.user : null;

    res.render('home', { allBlogs, user });
  } catch (err) {
    res.send(err);
  }
};

const getAuthPage = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    res.render('auth');
  }
};

const getDetailsPage = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const user = req.isAuthenticated() ? req.user : null;
    res.render('details', { blog, user });
  } catch (err) {
    res.send(err);
  }
};

const searchBlogs = async (req, res) => {
  try {
    const query = req.query.query;

     // Split the query into words and create a regex for each word
     const regexQueries = query.split(' ').map(word => new RegExp(word, 'i'));

     // Search for blogs that match the title, content, or any of the tags
     const searchResults = await Blog.find({
       $or: [
         { title: { $in: regexQueries } }, // Match title
         { content: { $in: regexQueries } }, // Match content
         { tags: { $in: regexQueries } } // Match tags
       ]
     });
    const user = req.isAuthenticated() ? req.user : null;
    
    res.render('search-results', { searchResults , user });
  } catch (error) {
    console.error('Error searching blogs:', error);
    res.status(500).send('Error searching blogs.');
  }
};

const getProfilePage = async (req, res) => {
  try {
    const username = req.params.username;

    // Fetch the user based on the username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if the authenticated user matches the profile user
    const isAuth = req.user && req.user.username === user.username;

    // Fetch the blogs for the specified user
    const userBlogs = await Blog.find({ author: user.username });

    res.render('profile', { user, userBlogs, isAuth });
  } catch (error) {
    console.error('Error fetching profile page:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getUpdateBlog = async (req, res) => {
  try {
    const username = req.user.username;

    const blog = await Blog.findById(req.params.id);

    // Fetch the user based on the username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if the authenticated user matches the profile user
    const isAuth = req.user && req.user.username === user.username;

    // Fetch the blogs for the specified user
    const userBlogs = await Blog.find({ author: user.username });

    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    res.render('update-blog', { user, userBlogs, isAuth, blog });
  } catch (error) {
    console.error('Error fetching profile page:', error);
    res.status(500).send('Internal Server Error');
  }
};

const submitBlog = async (req, res) => {
  try {
    const { title, content, tags, category } = req.body;
    const imagePath = req.file ? req.file.path : null;
    const author = req.user.username;
    const tagsArray = tags.split(',').map((tag) => tag.trim());

    const blog = new Blog({
      author,
      title,
      content,
      category,
      tags: tagsArray,
      image: imagePath,
    });

    const savedBlog = await blog.save();

    if (savedBlog) {
      res.redirect('/home');
    } else {
      res.redirect('/profile');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    // Delete the blog by ID
    await Blog.findByIdAndDelete(blogId);

    res.redirect('/profile');
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).send('Error deleting blog.');
  }
};

const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, content, tags, category } = req.body;

    // Assuming imagePath should be updated if a new image is uploaded
    const imagePath = req.file ? req.file.path : null;
    

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        content,
        category,
        tags: tags.split(',').map((tag) => tag.trim()),
        image: imagePath || undefined, // Only update image if a new one is uploaded
      },
      { new: true }
    );

    res.redirect(`/blog/${blogId}`);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).send('Error updating blog.');
  }
};

const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, { $inc: { likes: 1 } }, { new: true });
    res.redirect(`/blog/${blogId}`);
  } catch (error) {
    console.error('Error liking blog:', error);
    res.status(500).send('Error liking blog.');
  }
};

const addComment = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { comment } = req.body;
    const username = req.user && req.user.username ? req.user.username : 'Unknown User';

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: {
          comments: {
            user: username,
            text: comment,
          },
        },
      },
      { new: true }
    );

    res.redirect(`/blog/${blogId}`);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Error adding comment.');
  }
};

module.exports = {
  getHomePage,
  getAuthPage,
  getDetailsPage,
  searchBlogs,
  getProfilePage,
  getUpdateBlog,
  submitBlog,
  deleteBlog,
  updateBlog,
  likeBlog,
  addComment
};
