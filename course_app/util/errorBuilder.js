function errorBuilder(message, code = 500, details) {
    const err = new Error(message);
    err.message = message;
    err.code = code;
    err.details = details

    return err;
}

function errorHandler(err, req, res, next) {
    return res.status(500).json({
        message : err.message || 'INTERNAL SERVER ERROR',
        details :  err.details,
        code : err.code || 500
    });
}
module.exports = {
    errorBuilder,
    errorHandler
}