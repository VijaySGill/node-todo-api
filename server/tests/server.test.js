const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js')
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
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(function(response)
      {
        expect(response.body.todos.length).toBe(1);
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(function(response)
      {
        expect(response.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo document created by another user', function(done)
  {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token) // grab second user todo ID created by user one (which is wrong)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', function(done)
  {
    var hexID = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexID}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object IDs', function(done)
  {
    request(app)
      .get(`/todos/123abc`)
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[1].tokens[0].token)
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

  it('should not remove a todo created by someone else', function(done)
  {
    var hexID = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexID}`)
      .set('x-auth', users[1].tokens[0].token) // trying to delete first todo as second user
      .expect(404)
      .end(function(error, result)
      {
        if(error)
        {
          return done(error);
        }

        Todo.findById(hexID).then(function(todo)
        {
          expect(todo).toExist(); // todo should still exist as we weren't correct user
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
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', function(done)
  {
    request(app)
      .delete(`/todos/123abc`)
      .set('x-auth', users[1].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
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

    it('should not update a todo created by another user', function(done)
    {
      var hexID = todos[0]._id.toHexString(); // first Todo's hex ID
      var text = "This should be the new text";

      request(app)
        .patch(`/todos/${hexID}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({
          completed: true,
          text: text
        })
        .expect(404)
        .end(done);
      });

      it('should clear completedAt when todo is changed to not complete', function(done)
      {
        var hexID = todos[1]._id.toHexString(); // second Todo's hex ID
        var text = "This should be the new text";

        request(app)
        .patch(`/todos/${hexID}`)
        .set('x-auth', users[1].tokens[0].token)
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

describe('GET /users/me', function()
{
  it('should return user if authenticated', function(done)
  {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(function(response){
        expect(response.body._id).toBe(users[0]._id.toHexString());
        expect(response.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', function(done)
  {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(function(response)
      {
        expect(response.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', function()
{
  it('should create a valid user', function(done)
  {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({
        email: email,
        password: password
      })
      .expect(200)
      .expect(function(response)
      {
        expect(response.headers['x-auth']).toExist();
        expect(response.body._id).toExist();
        expect(response.body.email).toBe(email);
      })
      .end(function(error)
      {
        if(error)
        {
          return done(error);
        }

        User.findOne({email}).then(function(user)
        {
          expect(user).toExist();
          expect(user.password).toNotBe(password); // because it is hashed
          done();
        });
      });
  });

  it('should return validation errors if request invalid', function(done)
  {
    request(app)
      .post('/users')
      .send({
        email: 'invalid',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email already in use', function(done)
  {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'anyPassword'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', function()
{
  it('should login user and return auth token', function(done)
  {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(function(response)
      {
        expect(response.headers['x-auth']).toExist();
      })
      .end(function(error, response)
      {
        if(error)
        {
          return done(error);
        }

        User.findById(users[1]._id).then(function(user)
        {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: response.headers['x-auth']
          });
          done();
        }).catch(function(error)
        {
          done(error);
        });
      });
  });

  it('should reject invalid login', function(done)
  {
      request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: 'incorrestPassword'
        })
        .expect(400)
        .expect(function(response)
        {
          expect(response.headers['x-auth']).toNotExist();
        })
        .end(function(error, response)
        {
          if(error)
          {
            return done(error);
          }

          User.findById(users[1]._id).then(function(user)
          {
            expect(user.tokens.length).toBe(1);
            done();
          }).catch(function(error)
          {
            done(error);
          });
        });
  });
});

describe('DELETE /users/me/token', function()
{
  it('should remove auth token on logout', function(done)
  {
    var token = users[0].tokens[0].token

    request(app)
      .delete('/users/me/token')
      .set('x-auth', token)
      .expect(200)
      .end(function(error, message)
      {
        if(error)
        {
          return done(error)
        }

        else
        {
          User.findById(users[0]._id).then(function(user)
          {
            expect(user.tokens.length).toBe(0);
            done();
          }).catch(function(error)
          {
            done(error);
          });
        }
      });
  });
});
