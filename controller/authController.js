const User = require('../models/userModel');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const email = require('emailjs');
const crypto = require('crypto');

const signToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
} 

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        //secure: true,
        httpOnly: true
    }
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signUp = async (req, res, next) => {
    try{
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role
        });

        createSendToken(newUser, 200, res);
    }catch(err) {
        next(new AppError(err.message, 400, err));
    }
};

exports.signIn = async (req, res, next) => {
    try{
        const {email, password} = req.body;

    //1. Check if email and password exist
        if(!email || !password){
            return next(new AppError('Missing email or password!', 400, ''))
        }
    //2. Check if user exist && and password is correct
        const user = await User.findOne({email: email}).select('+password');

        if(!user || !(await user.correctPassword(password, user.password))){
            return next(new AppError('Incorrect email or password!', 401, ''));
        }
    //3. If everthing is ok, send token to client
        createSendToken(user, 200, res);
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
            return next(new AppError(`Unauthorized token!`, 401, '' ))
        }
        //4. Check if user changed password after the token was issued

        //5. Grant access to protected route
        req.user = freshUser;
        next();
    }catch(err){
        next(new AppError(err.message, 401, err));
    }
};

exports.restrictTo = (...role) => {
    return (req, res, next) => {
        if(!role.includes(req.user.role)){
            return next(new AppError(`You don't have permission to perform this action`, 403, ''))
        }

        next();
    }
};

exports.forgetPassword = async (req, res, next) => {
    try{
        //1. Get user based on Posted email
        const user = await User.findOne({email: req.body.email})
        if(!user){
            return next(new AppError('There is no user with this email!', 404, ''))
        }
        //2. Generate the random reset token
        const resetToken = user.createPasswordResetToken();
        await user.save({validateBeforeSave: false});
        //3. Send it to user's email
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
        const server 	= email.server.connect({
            user:    "",
            password:"",
            host:    "",
            ssl:     true
        });

        server.send({
            text:    'Please click on the link to reset your password: ' + resetURL, 
            from:    "", 
            to:      req.body.email,
            subject: "testing emailjs"
        }, (err, message) => {
            if(err){
                return next(new AppError('Email sent failed!', 500, err))
            }else{
                res.status(200).json({
                    status: 'success',
                    message: message
                })
            }
        });
    }catch(err){
        next(new AppError(err.message, 400, err))
    }
    
};

exports.resetPassword = async (req, res, next) => {
    //1. Get user based on the token
    const HashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: HashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    //2. If token has not yet expired, and there is user, set the new password
    if(!user){
        return next(new AppError('Token is invalid or has expired!', 404, ''))
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordChangedAt = Date.now();
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    //3. Update changedPasswordAt property for the user

    //4. Log the server in, and send JWT
    /* const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    }) */
    createSendToken(user, 200, res);
};

exports.updatePassword = async (req, res, next) => {
    try{
        //1. Get user from collection
       const user = await User.findById(req.user._id).select('+password');
       const { currentPassword, newPassword } = req.body;
        //2. Check if POSTed password is correct
        if(!currentPassword){
            return next(new AppError('Missing current password!', 400, ''));
        }
        if(!(await user.correctPassword(currentPassword, user.password))){
            return next(new AppError('Current password is not correct!', 400, ''));
        }
        //3. If so, update password
        user.password = newPassword;
        user.passwordChangedAt = Date.now();
        user.passwordConfirm = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        //4. Log in user, send JWT
        createSendToken(user, 200, res);
    }catch(err){
        next(new AppError(err.message, 401, err))
    }
}