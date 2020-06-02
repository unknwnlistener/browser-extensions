'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SiteSchema = new Schema({
    session: [{
        url: {
            type: String,
            required: 'Kindly enter the URL'
        },
        tab_id: Number,
        title: String,
        active: {
            type: Boolean,
            default: false
        }

    }],
    created_date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Sites', SiteSchema);
