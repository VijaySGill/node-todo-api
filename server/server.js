var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minLength: 1,
    trim: true // removes all leading and ending white spaces
  },

  completed: {
    type: Boolean,
    default: false
  },

  completedAt: {
    type: Number,
    default: null
  }
});

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  }
});

var newUser = new User({
  email: 'VijayGill@hotmail.co.uk'
});

newUser.save().then(function(result)
{
  console.log('Saved user ' + result);
}, function(error)
{
  console.log('Unable to save todo ' + error);
});

// var newTodo = new Todo({
//   text: 'Go to sleep',
// })
//
// newTodo.save().then(function(result)
// {
//   console.log('Saved todo ' + result);
//
// }, function(error)
// {
//   console.log('Unable to save todo');
// });
