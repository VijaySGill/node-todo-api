var {User} = require('./../models/user');

var authenticate = function(request, response, next)
{
  var token = request.header('x-auth');

  User.findByToken(token).then(function(user)
  {
    if(!user)
    {
      return Promise.reject();
    }

    request.user = user;
    request.token = token;
    next();
  }).catch(function(e)
  {
    response.status(401).send();
  });
}

module.exports = {authenticate};
