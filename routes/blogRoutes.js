const router = require("express").Router(); 
const multer = require('../config/multer');
const isAuthenticated = require('../middlewares/isAuthenticated');
const blogController = require('../controllers/blogController');


router.get('/', isAuthenticated, blogController.getHomePage);

// router.get('/test', (req,res)=>{
//   res.render('test');
// });

router.get('/auth', blogController.getAuthPage);

router.get('/home', isAuthenticated, blogController.getHomePage);

router.get('/search', isAuthenticated, blogController.searchBlogs);

router.get('/blog/:id', isAuthenticated, blogController.getDetailsPage);

router.get('/profile/:username', isAuthenticated, blogController.getProfilePage);

router.get('/update-blog/:id', isAuthenticated, blogController.getUpdateBlog);

router.post('/blog', isAuthenticated, multer.single('image'), blogController.submitBlog);

router.post('/blog/:id/update', isAuthenticated, multer.single('image'), blogController.updateBlog);

router.get('/blog/:id/delete', isAuthenticated, blogController.deleteBlog);

router.post('/blog/:id/like', blogController.likeBlog);

router.post('/blog/:id/comments', isAuthenticated, blogController.addComment);

//Export router
module.exports = router;

