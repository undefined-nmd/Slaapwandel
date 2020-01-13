'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = (0, _express.Router)();

/**
 * GET home page
 */
routes.get('/', (req, res) => {
  res.sendFile(_path2.default.join(__dirname, '../public/index.html'));
});

routes.get('/signup', (req, res) => {
  res.sendFile(_path2.default.join(__dirname, '../public/signup.html'));
});

routes.get('/walkthrough', (req, res) => {
  res.sendFile(_path2.default.join(__dirname, '../public/walkthrough.html'));
});
/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
routes.get('/list', (req, res, next) => {
  const { title } = req.query;

  if (title == null || title === '') {
    // You probably want to set the response HTTP status to 400 Bad Request
    // or 422 Unprocessable Entity instead of the default 500 of
    // the global error handler (e.g check out https://github.com/kbariotis/throw.js).
    // This is just for demo purposes.
    next(new Error('The "title" parameter is required'));
    return;
  }

  res.render('index', { title });
});

exports.default = routes;
//# sourceMappingURL=routes.js.map