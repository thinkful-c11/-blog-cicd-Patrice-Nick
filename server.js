'use strict';

const express = require('express');
const morgan = require('morgan');

const {BlogPosts} = require('./models');

const app = express();

const blogPostsRouter = require('./routes/blogposts.js');

app.use(morgan('common'));

app.use('/blog-posts', blogPostsRouter);

BlogPosts.create("Dogs", "are cool", "cats");
BlogPosts.create("Dogs", "are cool", "cats");
BlogPosts.create("Dogs", "are cool", "cats");

app.listen(process.env.PORT  || 3000, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 3000}`);
});
