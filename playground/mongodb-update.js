// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', function(error, db)
{
  if(error)
  {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

//   db.collection('Todos').findOneAndUpdate({
//     _id: new ObjectID('5b0481e4aeb7cdb59fc1c22f')
//   }, {
//     $set: {
//       completed: true
//     }
//   }, {
//     returnOriginal: false
//   }).then(function(result)
// {
//   console.log(result);
// });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5af725a5b81a9d10c7b619ac')
  }, {
        $set: {
          name: 'Beyoncé'
        },

        $inc: {
          age: 1
        }
  }, {
    returnOriginal: false
  }).then(function(result)
  {
    console.log(result);
  });

  // db.close();
});
