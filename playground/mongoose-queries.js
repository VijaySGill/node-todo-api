const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

var id = '5b05de171bcf2a0603386eee';

// if(!ObjectID.isValid(id))
// {
//   console.log('ID not valid');
// }

// Todo.find({ // returns all objects
//   _id: id
// }).then(function(todos)
// {
//   if(!todos)
//   {
//     return console.log('ID not found');
//   }
//
//   console.log('Todos', todos);
// });
//
// Todo.findOne({ // returns the FIRST object
//   _id: id
// }).then(function(todo)
// {
//   if(!todo)
//   {
//     return console.log('Object not found');
//   }
//
//   console.log('Todo', todo);
// });

// Todo.findById(id).then(function(todo) // returns one object
// {
//   if(!todo)
//   {
//     return console.log('ID not found');
//   }
//
//   console.log('Todo by ID', todo);
// }).catch(function(error)
// {
//   console.log(error);
// });

// User.findById
// case 0: query works, no User
// case 1: user was found
// case 2: handle any errors - print the error object

User.findById(id).then(function(user)
{
  if(!user)
  {
    return console.log('User could not be found');
  }

  console.log(JSON.stringify(user, undefined, 2));
}).catch(function(error)
  {
    console.log('ID not valid');
  });
