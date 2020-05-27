const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');
const AppError = require('./utils/appError');
const hpp = require('hpp');
// Middlewares

//Set security HTTP headers
app.use(helmet());

app.use(express.json({limit: '10kb'}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp({
    whitelist: ['duration', 
                'ratingsQuantity', 
                'ratingsAverage', 
                'maxGroupSize', 
                'difficulty', 
                'price']
}));

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 1 minutes
    max: 100 // limit each IP to 10 requests per windowMs
  });
   
  //  apply to all requests
app.use('/api', limiter);

// Routes Middleware
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);

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
    err.code = err.error.code;
    err.path = err.error.path;
    err.value = err.error.value;
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
            if(err.name === 'JsonWebTokenError'){
                message = 'Invalid token, please login again!'
            }
            if(err.name === 'TokenExpiredError'){
                message = 'Your token has expired, please login again!'
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



