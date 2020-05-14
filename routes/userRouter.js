const express = require('express');

const { 
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controller/userController');

const userRouter = express.Router();
userRouter.route('/').get(getUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;