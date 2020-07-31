// const sgMail = require('@sendgrid/mail');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const Datauri = require('datauri/parser');

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// exports.sendEmail = (mailOptions) => {
//     return new Promise((resolve, reject) => {
//         sgMail.send(mailOptions, (error, result) => {
//             if (error) return reject(error);
//             return resolve(result);
//         });
//     });
// }

exports.uploader = (req) => {
    return new Promise((resolve, reject) => {
        const dUri = new Datauri();
        let image = dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
        cloudinary.uploader.upload(image.content, (err, url) => {
            if (err) return reject(err);
            return resolve(url);
        })
    });
}


// Additional Functions
/*
* Deprected: Following the format of sending data packets in {data: null, errors: [{type : 'warning', message: 'Group not found'} ]}

 Format:     status: success, failure
                data: actual for success, error stuff for failure
                message: one line summary message

*/

// -- Only single error passed
exports.result_send = (res, value, err, statusCode=200, message="") => {

    let result = {
        'status': 'success',
        'data': {},
        'message': {}
    };

    // if(statusCode != 200) {
        res.status(statusCode);
    // }
    if (err == null) {
        if (value == null) {
            console.error("[Controller][Send] Invalid argument. No value passed to send");
            return;
        } else {
            result.data = value;
            result.message = "Returning value successfully";
        }
    } else {
        result = {
            status: 'error',
            data: err,
            message: 'An error occured'
        }
    }
    
    if(message != "") {
        result.message = message;
    }

    if (value || err) {
        return res.send(result);
    }
}

exports.error_send = (res, err, statusCode=404) => {
    this.result_send(res, null, err, statusCode, err.message)
}
