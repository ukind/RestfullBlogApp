const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

mongoose.connect('mongodb://localhost/blogDatabase');

const bootstrapJS = '/node_modules/bootstrap/dist/js';
const bootstrapCSS = '/node_modules/bootstrap/dist/css';
const jqueryJS = '/node_modules/jquery/dist/';
const fontAwesome = '/node_modules/font-awesome/css/';

app.disable('etag');
app.set('view engine', 'ejs');
app.use('/vendor', express.static(__dirname + bootstrapJS));
app.use('/vendor', express.static(__dirname + bootstrapCSS));
app.use('/vendor', express.static(__dirname + jqueryJS));
app.use('/vendor', express.static(__dirname + fontAwesome));

app.use(bodyParser.urlencoded({extended: true}));

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

app.get('/blogs', (req, res) => {
  // using promise
  var promise2 = Blog.find({}, (error, result) => {
    if (error) {
      console.log(error);
    }
    return result;
  });

  var promise1 = Blog.count({}, (error, result) => {
    if (error) {
      console.log(error);
    }
    return result;
  });

  Promise.all([promise2, promise1]).then(function(value) {
    res.render('index', {blogPostHTML: value[0], blogCountHTML: value[1]});
  });

});

app.get('/*', (req, res) => {
  res.send('Page not found');
});

app.listen(9999, process.env.IP, () => {
  // clearing console
  // console.log('\x1Bc');
  console.log('server started');
});
