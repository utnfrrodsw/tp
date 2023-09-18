const xss = require('xss');
var v = require('validator');

const handleError = (res, errorMessage) => {
	res.status(500).json({ success: false, msg: errorMessage });
};

const response = (success, data = null, msg = "") => {
	return {
		success,
		data,
		msg,
	};
};

const sanitizeInputParams = (inputParams) => {
    let sanitizedParams = {};

    for (const key in inputParams) {
        const paramValue = inputParams[key];
        const sanitizedValue = v.escape(xss(paramValue));
        sanitizedParams[key] = sanitizedValue;
    }

    return sanitizedParams;
};

module.exports = {
    handleError,
    response,
    sanitizeInputParams
};
