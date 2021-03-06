require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, function(request, response)
{
  var todo = new Todo({
    text: request.body.text,
    _creator: request.user._id
  });

  todo.save().then(function(document)
  {
    response.send(document);
  }, function(error)
  {
    response.status(400).send(error);
  });
});

app.get('/todos', authenticate, function(request, response)
{
  Todo.find({
    _creator: request.user._id // find all todos created by currently logged-in user
  }).then(function(todos)
  {
    response.send(
    {
      todos: todos // easier to send as an object if ever I need to tack something on
    });
  }, function(error)
  {
    response.status(400).send(error);
  }); // returns every todo
});

app.get('/todos/:id', authenticate, function(request, response)
{
  var id = request.params.id; // request.params returns key value pair where key is :id variable and value is whatever you assign to it

  if(!ObjectID.isValid(id))
  {
    return response.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: request.user._id
  }).then(function(todo) // returns one object
  {
    if(!todo)
    {
      return response.status(404).send();
    }

    response.send({
    todo: todo
  });
  }).catch(function(error)
  {
    response.status(400).send();
  });
});

app.delete('/todos/:id', authenticate, function(request, response)
{
  var id = request.params.id; // request.params returns key value pair where key is :id variable and value is whatever you assign to it

  if(!ObjectID.isValid(id))
  {
    return response.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: request.user._id
  }).then(function(todo) // returns one object - the todo deleted
  {
    if(!todo)
    {
      return response.status(404).send();
    }

    response.send({
    todo: todo
  });

  }).catch(function(error)
  {
    response.status(400).send();
  });
});

app.patch('/todos/:id', authenticate, function(request, response)
{
  var id = request.params.id;
  var body = _.pick(request.body, ['text', 'completed']); // pick is a function that allows you to specify the ONLY properties user can modify on todo ObjectID

  if(!ObjectID.isValid(id))
  {
    return response.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed == true)
  {
    body.completedAt = new Date().getTime(); // returns JavaScript time stamp
  }

  else {
    body.completed = false;
    body.completedAt = null
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator: request.user._id
  }, {$set: body}, {new: true}).then(function(todo)
  {
    if(!todo)
    {
      return response.status(404).send();
    }

    response.send({
      todo: todo
    });

  }).catch(function(error)
  {
    response.status(400).send();
  });
});

app.post('/users', function(request, response) // SIGNING UP NEW USERS AND ASSIGNING AUTH TOKEN
{
  var body = _.pick(request.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(function()
  {
    return user.generateAuthToken();
  }).then(function(token)
  {
    response.header('x-auth', token).send(user);
  }).catch(function(error)
  {
    response.status(400).send(error);
  });
});

app.get('/users/me', authenticate, function(request, response)
{
  response.send(request.user)
});


app.post('/users/login', function(request, response)
{
  var body = _.pick(request.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then(function(user)
  {
    return user.generateAuthToken().then(function(token)
    {
      response.header('x-auth', token).send(user); // send generated token to signed-in user
    });
  }).catch(function(error)
  {
    // fires if no user was returned
    response.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, function(request, response)
{
  request.user.removeToken(request.token).then(function()
  {
    response.status(200).send();
  }, function()
  {
    response.status(400).send();
  });
});

app.listen(port, function()
{
  console.log(`Started up at port ${port}`);

  console.log(process.env.MONGODB_URI);
});

module.exports = {app};
