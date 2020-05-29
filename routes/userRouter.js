const express = require('express');

const { 
    getUsers,
    getUser,
    createUser,
    getMe,
    updateMe,
    deleteMe,
    deleteUser
    } = require('../controller/userController');

const { signUp, 
        signIn, 
        forgetPassword, 
        resetPassword, 
        updatePassword, 
        protect,
        restrictTo
    } = require('../controller/authController');

const userRouter = express.Router();

userRouter.route('/').get(getUsers);
userRouter.route('/:id').delete(protect, restrictTo('admin'), deleteUser);

//userRouter.route('/signup').post(signUp);
userRouter.post('/signup', signUp);
userRouter.post('/signin', signIn);
userRouter.post('/forgotPassword', forgetPassword);
userRouter.patch('/resetPassword/:token', resetPassword);
userRouter.patch('/updatePassword', protect, updatePassword);
userRouter.patch('/updateMe', protect, updateMe);
userRouter.delete('/deteleMe', protect, deleteMe);
userRouter.get('/me', protect, getMe, getUser);

module.exports = userRouter;