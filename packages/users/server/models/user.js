'use strict';

/**
 * Module dependencies.
 */
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    crypto    = require('crypto'),
    _   = require('lodash');

var UserSchema = new Schema({
        first_name:{
            type: String,
            required: true,
            match: /.{2,15}/
        },
        mid_name:{
            type: String
        },
        last_name:{
            type: String,
            required: true
        },
        hashed_password:{
            type: String,
            required: true
        },
        salt: {
            type:String,
            default:'1234'
        },
        join_date:{
            type: Date,
            default:Date.now(),
            required: true
        },
        work_phone:{
            type: String
        },
        home_phone:{
            type: String
        },
        mobile_phone:{
            type: Number
        },
        email:{
            type: String,
            required: true,
            unique :true
        },
        messenger_id:{
            type: String
        },
        active:{
            type: Boolean,
            required: true,
            default:true
        },
        resetPasswordToken : {
            type : String
        },
        resetPasswordExpires : {
            type : Date
        },
        organization:{
            type:Schema.ObjectId,
            ref:'Organization'
        },
        projects :[{
            id:{
                type:Schema.ObjectId,
                ref:'Project'
            },
            role:{
                type:String
            }
        }],
        roles:[]
    },
    {
        strict: true
    });

UserSchema.virtual('fullname').get(function () {
    return this.first_name + ' ' + this.last_name;
});

UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.hashPassword(password);
}).get(function() {
    return this._password;
});


UserSchema.methods = {
    /**
     * HasRole - check if the user has required role
     *
     * @return {Boolean}
     * @api public
     * @param role
     */
    hasRole: function(role) {
        var roles = this.roles;
        return roles.indexOf('admin') !== -1 || roles.indexOf(role) !== -1;
    },

    /**
     * IsAdmin - check if the user is an administrator
     *
     * @return {Boolean}
     * @api public
     */
    isAdmin: function() {
        return this.roles.indexOf('admin') !== -1;
    },

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return this.hashPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Hash password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    hashPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    },

    /**
     * Hide security sensitive fields
     *
     * @returns {*|Array|Binary|Object}
     */
    toJSON: function() {
        var obj = this.toObject();
        delete obj.hashed_password;
        delete obj.salt;
        return obj;
    }
};

mongoose.model('User', UserSchema);