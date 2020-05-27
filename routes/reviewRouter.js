const express = require('express');
const {getReviews, createReview, getReview} = require('../controller/reviewController');
const {protect, restrictTo} = require('../controller/authController');

const reviewRouter = express.Router({mergeParams: true});

reviewRouter.route('/').get(protect, getReviews).post(protect, createReview);
reviewRouter.route('/:reviewId').get(protect, getReview);

module.exports = reviewRouter;