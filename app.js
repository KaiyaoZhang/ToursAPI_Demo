const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const AppError = require('./utils/appError');

// Middlewares
app.use(express.json());
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));

// Routes Middleware
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404, ''));
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    err.name = err.error.name || 'Error';
    err.code = err.error.code || 'null';
    err.path = err.error.path || 'null';
    err.value = err.error.value || 'null';
    err.error = err.error;

    if(process.env.NODE_ENV === 'development'){
        res.status(err.statusCode).json({
            static: err.status,
            name: err.name,
            path: err.path,
            value: err.value,
            code: err.code,
            error: err.error,
            message: err.message,
            stack: err.stack
        })
    }else if(process.env.NODE_ENV === 'production'){
        if(err.isOperational){
            let message = err.message;
            if(err.name === 'CastError'){
                message = `Invalid ${err.path}: ${err.value}`;
            }
            if(err.code === 11000){
                const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/g);
                message = `Duplicate field value: ${value}, Please use a unique one.`
            }
            res.status(err.statusCode).json({
                static: err.status,
                message: message
            })
        }else{
            //Programming or some other unknow error!
            //1. Log error
            console.error(err);
            //2. Send generic error
            res.status(500).json({
                status: 'fail',
                message: 'Something went wrong!'
            })
        }
    }
})

module.exports = app;



