'use strict';

/**
 * Module dependencies.
 */
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

var OrganizationSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    email:{
        type: String,
        required: true
    },
    contact_person:{
        type: String
    },
    contact_number:{
        type: Number
    },
    url:{
        type: String
    },
    active:{
        type: Boolean,
        default: true
    },
    created_by:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    created_on:{
        type:Date,
        default:Date.now()
    },
    deleted:{
        type: Boolean,
        default: false
    },
    deleted_by:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    deleted_on:{
        type:Date
    },
    modified_by:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    modified_on:{
        type:Date,
        default:Date.now()
    },
    timezone:{
        type: String,
        default:'IST'
    },
    cut_off_time:{
        type:String
    },
    cut_off_day:{
        type:String
    },
    cs_cut_off_time:{
        type:String
    },
    day_of_week:{
        type:String
    },
    validity_period:{
        type:Number,
        default:1
    },
    logo : {
        type:String
       /* required: true*/
    },
    roles:[
        {
            name:{
                type:String,
                required:true
            },
            template:[String]
        }
    ]
});

mongoose.model('Organization', OrganizationSchema);