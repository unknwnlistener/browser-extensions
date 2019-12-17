'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SiteSchema = new Schema({
  url: {
    type: String,
    required: 'Kindly enter the URL'
  },
  tab_id: Number,
  title: String,
  created_date: {
    type: Date,
    default: Date.now
  },
  active: {
      type: Boolean,
      default: false
  }
});

mongoose.model('Sites', SiteSchema);
