require("dotenv").config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path'); 
const mongoose = require("mongoose");
const passport = require('passport');

//require routes 
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

const publicPath = path.join(__dirname, 'public');
const uploadsPath = path.join(__dirname, 'uploads');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicPath));
app.use('/uploads', express.static(uploadsPath));

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=()');
  next();
});

//connect to dadabase 
mongoose.connect(process.env.DB_CONNECT,{
  useNewUrlParser: true,
  useUnifiedTopology: true})
.then(()=>console.log('Connect success '))
.catch(err=>console.log(err));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

// initialise passport 
app.use(passport.initialize());
app.use(passport.session());

// use routes 
app.use('/',userRoutes);
app.use('/',blogRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

