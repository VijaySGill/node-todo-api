const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', function(request, response)
{
  var todo = new Todo({
    text: request.body.text
  });

  todo.save().then(function(document)
  {
    response.send(document);
  }, function(error)
  {
    response.status(400).send(error);
  });
});

app.get('/todos', function(request, response)
{
  Todo.find().then(function(todos)
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

app.get('/todos/:id', function(request, response)
{
  var id = request.params.id; // request.params returns key value pair where key is :id variable and value is whatever you assign to it

  if(!ObjectID.isValid(id))
  {
    return response.status(404).send();
  }

  Todo.findById(id).then(function(todo) // returns one object
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

app.delete('/todos/:id', function(request, response)
{
  var id = request.params.id; // request.params returns key value pair where key is :id variable and value is whatever you assign to it

  if(!ObjectID.isValid(id))
  {
    return response.status(404).send();
  }

  Todo.findByIdAndRemove(id).then(function(todo) // returns one object - the todo deleted
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

app.patch('/todos/:id', function(request, response)
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

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(function(todo)
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

app.listen(port, function()
{
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
