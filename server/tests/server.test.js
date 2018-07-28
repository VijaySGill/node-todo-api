const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', function()
{
  it('should create a new todo', function(done)
  {
    var text = 'Test todo';

    request(app)
      .post('/todos')
      .send({
        text: text
      })
      .expect(200)
      .expect(function(response)
      {
        expect(response.body.text).toBe(text);
      })
      .end(function(error, response)
      {
        if(error)
        {
          return done(error);
        }

        Todo.find({text}).then(function(todos)
        {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(function(error)
        {
          done(error);
        });
      });
  });

  it('should not create todo with invalid body', function(done)
  {
    request(app)
      .post('/todos')
      .send({ //sending an EMPTY object

      })
      .expect(400)
      .end(function(error, response)
      {
        if(error)
        {
          return done(error);
        }

        Todo.find().then(function(todos)
        {
          expect(todos.length).toBe(2);
          done();
        }).catch(function(error)
        {
          done(error);
        });
      });
  });
});

describe('GET /todos', function()
{
  it('should get all todos', function(done)
  {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(function(response)
      {
        expect(response.body.todos.length).toBe(2);
      })

      .end(done);
  });
});

describe('GET /todos/id', function()
{
  it('should return todo document with a specific ID', function(done)
  {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(function(response)
      {
        expect(response.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', function(done)
  {
    var hexID = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexID}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object IDs', function(done)
  {
    request(app)
      .get(`/todos/123abc`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', function()
{
  it('should remove a todo', function(done)
  {
    var hexID = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexID}`)
      .expect(200)
      .expect(function(response)
      {
        expect(response.body.todo._id).toBe(hexID);
      })
      .end(function(error, result)
      {
        if(error)
        {
          return done(error);
        }

        Todo.findById(hexID).then(function(todo)
        {
          expect(todo).toNotExist();
          done();
        }).catch(function(error)
        {
          done(error);
        });
      });
  });

  it('should return 404 if todo not found', function(done)
  {
    var hexID = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexID}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', function(done)
  {
    request(app)
      .delete(`/todos/123abc`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', function()
{
  it('should update the todo', function(done)
  {
    var hexID = todos[0]._id.toHexString(); // first Todo's hex ID
    var text = "This should be the new text";

    request(app)
      .patch(`/todos/${hexID}`)
      .send({
        completed: true,
        text: text
      })
      .expect(200)
      .expect(function(response)
      {
        expect(response.body.todo.text != todos[0].text);
        expect(response.body.todo.completed).toBe(true);
        expect(response.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is changed to not complete', function(done)
  {
    var hexID = todos[1]._id.toHexString(); // second Todo's hex ID
    var text = "This should be the new text";

    request(app)
      .patch(`/todos/${hexID}`)
      .send({
        completed: false, // now changing from completed to false
        text: text
      })
      .expect(200)
      .expect(function(response)
      {
        expect(response.body.todo.text != todos[1].text);
        expect(response.body.todo.completed).toBe(false);
        expect(response.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});
