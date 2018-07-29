var mongoose = require('mongoose');

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
  },

  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {
  Todo: Todo
};
