// Additional Functions
/*
Following the format of sending data packets in {data: null, errors: [{type : 'warning', message: 'Group not found'} ]}
Input Parameters:   res: response of the api call to send final data structure
                    value: data value to be passed
                    err_type: type of error criticalness
                    err_msg: frontend error message display help

[TODO] New format:     status: success, failure
                data: actual for success, error stuff for failure
                message: one line summary message
*/

// [TODO] Chaining multiple errors by pushing them. Currently only one even though its an array.
// -- Only single error passed
exports.result_send = (res, value, err, statusCode=200) => {

    let result = {
        'data': {},
        'errors': {}
    };

    if(statusCode != 200) {
        res.status(statusCode);
    }

    if (err == null) {
        if (value == null) {
            console.error("[Controller][Send] Invalid argument. No value passed to send");
            return;
        } else {
            result.data = value;
        }
    } else {
        result.errors = err;
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
