const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
    unique: true, // 2 users can't have same email
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email address'
    }
  },
  password: {
    type: String,
    require: true,
    minLength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function() // overriding default mongoose toJSON method - we only want to see id and email in POSTMAN response
{
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() // custom method to create and assign token to user once signed up
{
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    _id: user._id.toHexString(),
    access: access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{ // push created token to user token array
    access: access,
    token: token
  }]);

  return user.save().then(function()
  {
    return token;
  });
};

UserSchema.statics.findByToken = function(token) // model method, not instance
{
  var User = this;
  var decoded;

  try
  {
    decoded = jwt.verify(token, 'abc123');
  }

  catch(e)
  {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {
  User: User
};
