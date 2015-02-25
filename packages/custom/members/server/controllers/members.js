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
    var organization = new Organization(req.body);
    //var user = new User(req.body);

    //user.provider = 'local';

    // because we set our user.provider to local our models/user.js validation will always be true
    /*req.assert('name', 'You must enter a name').notEmpty();
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('contact_person', 'You must enter a contact person').notEmpty();
    req.assert('contact_number', 'You must enter a contact number').notEmpty();*/
    //req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    //req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
    //req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }
    organization.name = 'ABCDE';
    organization.email = 'a@b.com';
    organization.contact_person = 'ABCDE';
    organization.contact_number = '123333';
    organization.roles = [{name:'Admin'}];
    console.log(organization);
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
            var user = new User();
            user.login = 'skaithepalli12';
            user.first_name = 'Sudhakar12';
            user.last_name = 'Kaithepalli12';
            user.password = 'Test?12345';
            user.organization = organization;
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
                   console.log(organization);
                   Organization.where({ _id: organization._id }).update({ created_by: user }, function(err){
                       console.log("Updated!")
                   });
               }
            });
            res.status(200).json([
                {
                    msg:'Success'
                }
            ]);
        }
    });
};


exports.userCreate = function(req, res, next) {

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