// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', function(error, db)
{
  if(error)
  {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  // db.collection('Todos').deleteMany({text: 'Eat dinner'}).then(function(result)
  // {
  //   console.log(result);
  // });

  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then(function(result)
  // {
    // console.log(result);
  // });

  // db.collection('Todos').findOneAndDelete({completed: true}).then(function(result)
  // {
  //   console.log(result)
  // });

  // db.close();
});
