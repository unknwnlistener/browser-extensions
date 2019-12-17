'use strict';


var mongoose = require('mongoose'),
  Site = mongoose.model('Sites');

exports.list_all_sites = function(req, res) {
  Site.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};




exports.create_a_site = function(req, res) {
  var new_site = new Site(req.body);
  new_site.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.read_a_site = function(req, res) {
  Site.findById(req.params.taskId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.update_a_site = function(req, res) {
  Site.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.delete_a_site = function(req, res) {


  Site.remove({
    _id: req.params.taskId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};
