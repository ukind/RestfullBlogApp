const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

mongoose.connect('mongodb://localhost/blogDatabase');

const bootstrapJS = '/node_modules/bootstrap/dist/js';
const bootstrapCSS = '/node_modules/bootstrap/dist/css';
const jqueryJS = '/node_modules/jquery/dist/';
const fontAwesome = '/node_modules/font-awesome/css/';
const user = '/views/user/css/';

app.set('view engine', 'ejs');
app.use('/vendor', express.static(__dirname + bootstrapJS));
app.use('/vendor', express.static(__dirname + bootstrapCSS));
app.use('/vendor', express.static(__dirname + jqueryJS));
app.use('/vendor', express.static(__dirname + fontAwesome));
app.use('/user', express.static(__dirname + user));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const blogSchema = new mongoose.Schema({

  title: String,
  image: {type: String, default: 'https://www.mountaineers.org/images/placeholder-images/placeholder-400-x-400/image'},
  post: String,
  created: {
    type: Date,
    default: Date.now
  }
});

const Blog = mongoose.model('Blog', blogSchema);

// restful routes
// Blog.create({
//   title: 'Utamakan Belajar',
//   post: 'isian dari judul post',
//
// });

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// new blog post
app.get('/blogs/new', function(req, res) {
  res.render('new');
});

// show all blog posts
app.get('/blogs', (req, res) => {
  // using promise
  let promise2 = Blog.find({}, (error, result) => {
    if (error) {
      console.log(error);
    }
    return result;
  });
  let promise1 = Blog.count({}, (error, result) => {
    if (error) {
      console.log(error);
    }
    return result;
  });
  // joining all promise
  Promise.all([promise2, promise1]).then(function(value) {
    res.render('index', {blogPostHTML: value[0], blogCountHTML: value[1]});
  });

});

// creating new blogpost
app.post('/blogs', function(req, res) {
  Blog.create({
    title: req.body.blog.title,
    post: req.body.blog.post,
    image: req.body.blog.image
  }, function(error, result) {
    if (error) {
      console.log(error);
    } else {
      res.redirect('blogs');
    }
  });
});

// read more blog
app.get('/blogs/:id', function(req, res) {
  Blog.findById(req.params.id, function(error, result) {
    if (error) {
      res.redirect('/blogs');
    } else {
      res.render('show', {detailBlog: result});
    }

  });
});

app.get('/blogs/:id/edit', function(req, res) {
  Blog.findById(req.params.id, function(err, result) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('edit', {editPostHTML: result});
    }
  });
});

// EDIT DATA
app.put('/blogs/:id', function(req, res) {
  const id = req.params.id;
  Blog.findByIdAndUpdate(id, {
    title: req.body.blog.title,
    post: req.body.blog.post,
    image: req.body.blog.image
  }, function(error, result) {
    if (error) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/' + id);
    }
  });
});

// DELETE / REMOVE POST
app.delete('/blogs/:id', function(req, res) {
  const blogID = req.params.id;
  // res.send('delete route reached');
  Blog.findByIdAndRemove(blogID, function(error) {
    if (error) {
      console.log(error);
    } else {
      res.redirect('/blogs');
    }
  });
});

// error 404
app.get('/*', (req, res) => {
  res.send('Page not found');
});

app.listen(9999, process.env.IP, () => {
  // clearing console
  // console.log('\x1Bc');
  console.log('server started');
});
