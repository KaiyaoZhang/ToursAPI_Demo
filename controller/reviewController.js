const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const {deleteOne, updateOne, createOne, getOne, getAll} = require('./factoryController');

exports.getReviews = getAll(Review);

exports.getReview = getOne(Review);

exports.createReview = createOne(Review);

exports.updateReview = updateOne(Review);

//Question: when delete a tour, how to delete all the corresponed reviews?
exports.deleteReview = deleteOne(Review);