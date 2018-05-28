const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');

const todos = [{
  text: 'First test todo'
},{
  text: 'Second test todo'
}];

beforeEach(function(done) // runs BEFORE the test cases beginning with 'it'
{
  Todo.remove({}).then(function()
  {
    return Todo.insertMany(todos);
  }).then(function()
  {
    done();
  });
});

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
