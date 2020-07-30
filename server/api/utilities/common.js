const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// sgMail.setApiKey('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');


exports.sendEmail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        sgMail.send(mailOptions, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
}



// Additional Functions
/*
* Deprected: Following the format of sending data packets in {data: null, errors: [{type : 'warning', message: 'Group not found'} ]}

 New format:     status: success, failure
                data: actual for success, error stuff for failure
                message: one line summary message

[TODO] Improve the structure of this function. It shouldn't be coder specific but force the parameters to be correctly passed to it and handle all errors as syntactical and not runtime.
*/

// [TODO] Chaining multiple errors by pushing them. Currently only one even though its an array.
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

    // if(err_type !== undefined && err_msg !== undefined) {
    //     result['errors'] = {
    //         'type': err_type,
    //         'message': err_msg
    //     }
    // }
    if (value || err) {
        return res.send(result);
    }
}

exports.error_send = (res, err, statusCode=404) => {
    this.result_send(res, null, err, statusCode, err.message)
}
