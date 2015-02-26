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
    templates = require('../signupTemplate');


exports.createOrg = function(req, res, next){

    // because we set our user.provider to local our models/user.js validation will always be true
    req.assert('name', 'name should not be empty').notEmpty();
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('first_name', 'first_name should not be empty').notEmpty();
    req.assert('last_name', 'last_name should not be empty').notEmpty();
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    //req.assert('logo', 'Logo should not be empty.').notEmpty();


    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
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
                res.status(500).json(modelErrors);
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

            res.status(200).json([
                {
                    msg:'Success'
                }
            ]);
        }
    });
};

/**
 *Common method to save users.
 */
function createUser(req, res, next) {
    var user = new User(req.body);
    user.save(function(err){
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
               res.status(500).json(modelErrors);
           }
       } else {
           var mailOptions = {
               to: user.email,
               from: config.emailFrom
           };
           mailOptions = templates.signup_email(user, req, mailOptions);
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
}