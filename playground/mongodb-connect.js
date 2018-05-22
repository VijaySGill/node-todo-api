// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', function(error, db)
{
  if(error)
  {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'I need to do this',
  //   completed: false
  // }, function(error, result)
  //    {
  //       if(error)
  //       {
  //         return console.log('Unable to insert todo ' + error);
  //       }
  //
  //       console.log(JSON.stringify(result.ops, undefined, 2))
  //    });

  // db.collection('Users').insertOne({
  //   name: 'Vijay',
  //   age: 21,
  //   location: 'London, UK'
  // }, function(error, result)
  //    {
  //      if(error)
  //      {
  //        return console.log('Unable to insert user');
  //      }
  //
  //      console.log(JSON.stringify(result.ops, undefined, 2));
  //    });

  db.close();
});
