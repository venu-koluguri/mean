'use strict';

/**
 * Module dependencies.
 */
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

var UserSchema = new Schema({
        login:{
            type: String,
            required: true,
            trim:true,
            lowercase: true,
            match: /.{2,15}/
        },
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
        password:{
            type: String,
            required: true
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
            type: String
        },
        messenger_id:{
            type: String
        },
        active:{
            type: Boolean,
            required: true,
            default:true
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
    return this.first_name + ' ' + this.mid_name+ ' ' + this.last_name;
});

mongoose.model('user', UserSchema);