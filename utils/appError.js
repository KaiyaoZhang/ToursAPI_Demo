class AppError extends Error{
    constructor(message, statusCode, err){
        super(message);

        this.statusCode = statusCode;
        this.error = err;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError;