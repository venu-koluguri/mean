'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Organization = mongoose.model('Organization'),
    User = mongoose.model('user'),
    async = require('async'),
    config = require('meanio').loadConfig(),
    crypto = require('crypto'),
    nodemailer = require('nodemailer'),
    signupTemplates = require('../signupTemplate'),
    forgotpasswordTemplates = require('../forgotpasswordTemplate');


/**
 * Create organization.
 *
 * @param req
 * @param res
 * @param next
 */
exports.createOrg = function(req, res, next){

    // Server Side Validations.
    req.assert('name', 'name should not be empty').notEmpty();
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('first_name', 'first_name should not be empty').notEmpty();
    req.assert('last_name', 'last_name should not be empty').notEmpty();
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    //req.assert('logo', 'Logo should not be empty.').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).json({
            status : 'Error',
            error: errors
        });;
    }

    // Save Organization.
    var organization = new Organization(req.body);
    organization.save(function(err){
        if(err) {
            var modelErrors = [];
            if (err.errors) {
                for (var x in err.errors) {
                    modelErrors.push({
                        param: x,
                        msg: err.errors[x].message,
                        value: err.errors[x].value
                    });
                }
                return res.status(400).json({
                        status : 'Error',
                        error: modelErrors
                    });
            }
        } else {
            // Save User.
            req.body.organization = organization;
            var user = createUser(req, res, next);
            if(user) {
                // Update Organization.
                Organization.where({ _id: organization._id }).update({ created_by: user }, function(err){
                    console.log("Updated!")
                });
            }

            return res.status(200).json({
                    status : 'Success',
                    msg:'Organization created successfully.'
                });
        }
    });
};

/**
 * Forgot Password.
 *
 * @param req
 * @param res
 * @param next
 *
 */
exports.forgotpassword = function(req, res, next) {
    // Server Side Validations.
    req.assert('email', 'email should not be empty').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).json({
            status : 'Error',
            error: errors
        });
    }
    async.waterfall([
            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            }, function(token, done) {
                console.log(req.body.email);
                User.findOne({email: req.body.email}, function(err, user) {
                    console.log(user);
                    if (err || !user) {
                        return done(true);
                    }
                    done(err, user, token);
                });
            }, function(user, token, done) {
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                user.save(function(err) {
                    done(err, token, user);
                });
            }, function(token, user, done) {
                var mailOptions = {
                    to: user.email,
                    from: config.emailFrom
                };
                mailOptions = forgotpasswordTemplates.forgot_password_email(user, req, token, mailOptions);
                sendMail(mailOptions);
                done(null, true);
            }
        ],function(err, status) {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    status : 'Error',
                    msg : 'User does not exist'
                })
            } else {
               return res.status(200).json({
                    status : 'success',
                    msg : 'Mail successfully sent'
                })
            }
        }
    );
};

/**
 * Reset Password
 *
 * @param req
 * @param res
 * @param next
 *
 */

exports.resetpassword = function(req, res, next) {
    // Server Side Validations.
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).json({
            status : 'Error',
            msg : errors
        });
    }

    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()}
    }, function(err, user) {
        console.log(user);
        if (err) {
            return res.status(400).json({
                status : 'Error',
                msg: err
            });
        }
        if (!user) {
            return res.status(400).json({
                status : 'Error',
                msg: 'Token invalid or expired'
            });
        }


        user.hashed_password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save(function(err) {
            if(!err) {
                res.status(200).json({
                    status : 'Error',
                    msg : 'Password has been reset successfully, Please login.'
                });
            }
        });
    });
};

/**
 *Common method to save users.
 */
function createUser(req, res, next) {
    var user = new User(req.body);
    user.save(function(err){
       if(err) {
           console.log(err);
           var modelErrors = [];
           if (err.errors) {
               for (var x in err.errors) {
                   modelErrors.push({
                       param: x,
                       msg: err.errors[x].message,
                       value: err.errors[x].value
                   });
               }
              return res.status(500).json({
                   status : 'Fail',
                   error: modelErrors
               });
           }
       } else {
           var mailOptions = {
               to: user.email,
               from: config.emailFrom
           };
           mailOptions = signupTemplates.signup_email(user, req, mailOptions);
           sendMail(mailOptions);
       }
    });
    return user;
};


/**
 * Send reset password email
 */
function sendMail(mailOptions) {
    console.log(mailOptions);
    var transport = nodemailer.createTransport(config.mailer);
    transport.sendMail(mailOptions, function(err, response) {
        if (err) return err;
        return response;
    });
};

function generateToken() {
    crypto.randomBytes(20, function(err, buf) {
       var token = buf.toString('hex');
        console.log(token);
        return token;
    });
};