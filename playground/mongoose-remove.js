const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

Todo.findByIdAndRemove('5b1aea16aa8b48b3b7422b91').then(function(todo)
{
  console.log(todo);
});
