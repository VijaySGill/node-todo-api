const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, function(error, salt)
{
  bcrypt.hash(password, salt, function(error, hash)
  {
    // console.log(hash);
  });
});

var hashedPassword = '$2a$10$C8oh8GQ3gwOMXynv7xiiy.3k.byi8FLXUyhqonAmEXaIx09LKhtbG';

bcrypt.compare(password, hashedPassword, function(error, response)
{
  console.log(response);
});



// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
// var decoded = jwt.verify(token, '123abc');
// console.log('Decoded', decoded);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(resultHash === token.hash)
// {
//   console.log('Data was not changed');
// }
//
// else {
//   console.log('Data was changed. Do not trust!');
// }
