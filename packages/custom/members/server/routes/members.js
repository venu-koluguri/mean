'use strict';
var members = require('../controllers/members');
/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Members, app, auth, database,passport) {

  app.get('/members/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/members/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/members/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/members/example/render', function(req, res, next) {
    Members.render('index', {
      package: 'members'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });

    // Create Organization.
    app.route('/members/createOrg').post(members.createOrg);

    // Forgot Password.
    app.route('/members/forgot-password').post(members.forgotpassword);

    // Rest Password.
    app.route('/members/reset/:token').post(members.resetpassword);

    app.route('/members/login').post(passport.authenticate('local', {failureFlash: true}), function(req, res) {
       res.send({
           user: req.user
           // redirect: (req.user.roles.indexOf('admin') !== -1) ? req.get('referer') : false
        });
    });
};
