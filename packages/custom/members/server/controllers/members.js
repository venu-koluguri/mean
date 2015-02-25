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
    nodemailer = require('nodemailer');


exports.createOrg = function(req, res, next){

    // because we set our user.provider to local our models/user.js validation will always be true
    req.assert('name', 'You must enter a name').notEmpty();
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('contact_person', 'You must enter a contact person').notEmpty();
    req.assert('contact_number', 'You must enter a contact number').notEmpty();
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('login', 'Username cannot be more than 20 characters').len(2, 20);


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
            console.log(user);
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
function createUser(req, res,next) {
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
       }
    });
    return user;
};


/**
 * Send reset password email
 */
function sendMail(mailOptions) {
    var transport = nodemailer.createTransport(config.mailer);
    transport.sendMail(mailOptions, function(err, response) {
        if (err) return err;
        return response;
    });
}