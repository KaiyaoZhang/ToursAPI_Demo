const express = require('express');
const {getReviews, createReview, getReview, deleteReview, updateReview} = require('../controller/reviewController');
const {protect, restrictTo} = require('../controller/authController');

const reviewRouter = express.Router({mergeParams: true});

reviewRouter.route('/').get(protect, getReviews).post(protect, createReview);
reviewRouter.route('/:id').get(protect, getReview).delete(protect, deleteReview).patch(protect, updateReview);

module.exports = reviewRouter;