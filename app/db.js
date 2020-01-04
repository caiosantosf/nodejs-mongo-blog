var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect(process.env.DB_CONNECTION); 

process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    process.exit(0); 
  }); 
});

var posts = mongoose.model('posts', new Schema({
  title: String,
  titlePath: String,
  subtitle: String,
  author: String,
  type: String,
  content: String,
  priority: Number,
  hidden: Boolean,
  cover: String
}, {timestamps:{}}));

var events = mongoose.model('events', new Schema({
  title: String,
  link: String,
  place: String,
  date: Date
}, {timestamps:{}}));

module.exports = {posts, events} 