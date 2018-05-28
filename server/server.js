var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();

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

app.listen(3000, function()
{
  console.log('Started on port 3000');
});

module.exports = {app};
