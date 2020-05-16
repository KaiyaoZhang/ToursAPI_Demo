const express = require('express');

const { 
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controller/userController');

const { signUp, signIn } = require('../controller/authController');

const userRouter = express.Router();

userRouter.route('/').get(getUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

//userRouter.route('/signup').post(signUp);
userRouter.post('/signup', signUp);
userRouter.post('/signin', signIn);

module.exports = userRouter;