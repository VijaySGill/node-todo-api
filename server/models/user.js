const validator = require('validator');

var mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
    unique: true, // 2 users can't have same email
    validate: {
      validator: function(value)
      {

      }, message: '{VALUE} is not a valid email address'
    }
  }
});

module.exports = {
  User: User
};
