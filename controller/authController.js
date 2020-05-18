const User = require('../models/userModel');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');

const signToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
} 

exports.signUp = async (req, res, next) => {
    try{
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });

        const token = signToken(newUser._id);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                newUser: newUser
            }
        })
    }catch(err) {
        next(new AppError(err.message, 400, err));
    }
};

exports.signIn = async (req, res, next) => {
    try{
        const {email, password} = req.body;

    //1. Check if email and password exist
        if(!email || !password){
            return next(new AppError('Missing email or password!', 400))
        }
    //2. Check if user exist && and password is correct
        const user = await User.findOne({email: email}).select('+password');

        if(!user || !(await user.correctPassword(password, user.password))){
            return next(new AppError('Incorrect email or password!', 401, ''));
        }
    //3. If everthing is ok, send token to client
        const token = signToken(user._id);
        res.status(200).json({
            status: 'success',
            token,
            message: 'Logged in!'
        })
    }catch(err){
       next(new AppError(err.message, 404, err))
    }
};

exports.protect = async (req, res, next) => {
    try{
        //1. Getting token and check if it's here
        let token = '';
        const { authorization } = req.headers;
        if(authorization && authorization.startsWith('Bearer')){
            token = authorization.replace('Bearer ', '');
        }
        if(!token){
            next(new AppError('You are not logged in', 401, ''));
        }
        //2. Verification the token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {}, // passing an empty options object to get to callback
            (err, value) => {
            if (err) {
                return next(new AppError(err.message, 401, err));
            }
            return value
            }
        );
        //3. Check if user still exists
        const freshUser = await User.findById(decoded.id);
        if(!freshUser){
            return next(new AppError(`The user doesn't exit any more!`, 401, '' ))
        }
        //4. Check if user changed password after the token was issued

        //5. Grant access to protected route
        req.user = freshUser;
        next();
    }catch(err){
        next(new AppError(err.message, 401, err));
    }
}