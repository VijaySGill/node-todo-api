// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', function(error, db)
{
  if(error)
  {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  db.collection('Todos').find().toArray().then(function(documents)
  {
    console.log('Todos');
    console.log(JSON.stringify(documents, undefined, 2));
  }, function(error)
  {
    console.log('Unable to fetch Todos ' + error)
  });

  // db.close();
});
