const express = require('express');

const { 
    getUsers,
    getUser,
    createUser,
    updateMe,
    deleteMe,
    } = require('../controller/userController');

const { signUp, 
        signIn, 
        forgetPassword, 
        resetPassword, 
        updatePassword, 
        protect 
    } = require('../controller/authController');

const userRouter = express.Router();

userRouter.route('/').get(getUsers).post(createUser);
userRouter.route('/:id').get(getUser);

//userRouter.route('/signup').post(signUp);
userRouter.post('/signup', signUp);
userRouter.post('/signin', signIn);
userRouter.post('/forgotPassword', forgetPassword);
userRouter.patch('/resetPassword/:token', resetPassword);
userRouter.patch('/updatePassword', protect, updatePassword);
userRouter.patch('/updateMe', protect, updateMe);
userRouter.delete('/deteleMe', protect, deleteMe);

module.exports = userRouter;