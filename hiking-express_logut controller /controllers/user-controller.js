const config = require('../utils/config.js');
var User = require('../models/user-model.js');
const AuthSession = require('../models/auth-session-model.js');
const res_utils = require('../utils/res-utils.js');

// var userControler 


// CONTROLLERS

exports.getMyUserData = async (req, res, next) => {
  console.log('--- getMyUserData controller');
  console.log('req.headers');
  console.log(req.headers);
  try {
    // STEP get token from http headers
    const TOKEN_HEADER_KEY = config.TOKEN_HEADER_KEY;
    const token = req.headers[TOKEN_HEADER_KEY];
    console.log('token', token);

    // STEP find that token in loggedin sessions
    const session = await AuthSession.findOne({ token });
    console.log('session');
    console.log(session);
    if (session && session.user_id) {
      // user is logged in on backend
      const user_id = session.user_id;
      console.log('user_id');
      console.log(user_id);
      if (user_id) {
        console.log(user_id);
        // const user = await User.findOne({ _id: user_id });
        const user = await User.findById(user_id);
        console.log('user found');
        console.log(user);
        const response = res_utils.prepare_success_response({
          payload: {
            readme: 'this is response payload getMyUserData controller',
            token: token,
            user: {
              username: user.username,
              activated: user.activated
            }
          }
        });
        res.status(200).json(response);

      } else {
        response = res_utils.prepare_error_response({
          error_type: 'user not found'
        });
        res.status(500).json(response);
      }
    } else {
      response = res_utils.prepare_error_response({
        error_type: 'auth session not found'
      });
      res.status(500).json(response);
    }

  } catch (err) {
    response = 'errorrrr';
    response = res_utils.prepare_error_response({
      error_type: 'CATCH_ERROR_INSIDE_CIONTROLLER getMyUserData'
    });
    res.status(500).json(response);
  }
};


exports.getUserList = async (req, res, next) => {
};

exports.postUserCreate = async (req, res, next) => {
};

exports.postUserUpdate = async (req, res, next) => {
};

// module.exports = userControler;
