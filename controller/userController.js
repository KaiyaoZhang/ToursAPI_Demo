const User = require('../models/userModel');
const AppError = require('../utils/appError');

const filterObj = (obj, ...properties) => {
    let newObj = {};
    Object.keys(obj).forEach(el => {
        if(properties.includes(el)) newObj[el] = obj[el]
    })

    return newObj;
}

exports.getUsers = async (req, res, next) => {
    try{
        const Users = await User.find();
        res.status(200).json({
            status: 'success',
            results: Users.length,
            data: {
                Users: Users
            }
        })
    }catch(err){
        next(new AppError(err.message, 404, err));
    }
}

exports.getUser = (req, res) => {
    try{
        res.status(500).json({
            status: 'error',
            message: 'No information now'
        })
    }catch(err){
        console.log(err);
    }
}

exports.updateMe = async(req, res, next) => {
    try{
        if(req.body.password || req.body.passwordConfirm){
            return next(new AppError('This route is not for password change!', 400, ''))
        }
    
        const filteredBody = filterObj(req.body, 'name', 'email');
        const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
            new: true,
            runValidators: true
        })
    
        res.status(200).json({
            status: 'success',
            data: user
        })
    }catch(err){
        next(new AppError(err.message, 400, err));
    }
}

exports.createUser = (req, res) => {
    try{
        res.status(500).json({
            status: 'error',
            message: 'No information now'
        })
    }catch(err){
        console.log(err);
    }
}

exports.updateUser = (req, res) => {
    try{
        res.status(500).json({
            status: 'error',
            message: 'No information now'
        })
    }catch(err){
        console.log(err);
    }
}

exports.deleteMe = async (req, res, next) => {
    try{
        await User.findByIdAndUpdate(req.user._id, {active: false});
        res.status(204).json({
            status: 'success',
            data: null
        })
    }catch(err){
        next(new AppError(err.message, 400, err))
    }
}