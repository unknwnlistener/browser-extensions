'use strict';


var mongoose = require('mongoose'),
    Site = mongoose.model('Sites');

exports.list_all_sites = function (req, res) {
    console.log("GET call invoked");
    Site.find({}, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.create_new_sites = function (req, res) {
    console.log("POST call invoked");
    // let reqBody = req.body;
    console.log("Updating database with new sites", req.body);
    // if (Array.isArray(reqBody)) {
    //     console.log("IS ARRAY");
    //     reqBody.forEach(element => {
    //         console.log("Parsing each element", reqBody);
    //         let new_site = new Site(reqBody);
    //         new_site.save(function (err, task) {
    //             if (err)
    //                 res.send(err);
    //             res.json(task);
    //         });
    //     });
    // } else {
    //     res.json("[]");
    // }
    var new_site = new Site(req.body);
    new_site.save(function(err, task) {
    if (err)
        res.send(err);
    res.json(task);
    });
};


exports.read_a_site = function (req, res) {
    Site.findById(req.params.taskId, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.update_a_site = function (req, res) {
    Site.findOneAndUpdate({ _id: req.params.taskId }, req.body, { new: true }, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.delete_a_site = function (req, res) {


    Site.remove({
        _id: req.params.taskId
    }, function (err, task) {
        if (err)
            res.send(err);
        res.json({ message: 'Task successfully deleted' });
    });
};
