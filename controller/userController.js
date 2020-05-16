const User = require('../models/userModel');
const AppError = require('../utils/appError');

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

exports.deleteUser = (req, res) => {
    try{
        res.status(500).json({
            status: 'error',
            message: 'No information now'
        })
    }catch(err){
        console.log(err);
    }
}