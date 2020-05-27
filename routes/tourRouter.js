const express = require('express');
const {
    getTours, 
    addTour, 
    getTour, 
    updateTour, 
    deleteTour,
    aliasTopTours,
    getTourStat,
    getMonthlyTour
} = require( '../controller/tourController');
const {protect, restrictTo} = require('../controller/authController');
const reviewRouter = require('./reviewRouter');
//const {createReview, getReview} = require('../controller/reviewController');
const tourRouter = express.Router();

//tourRouter.param('id', checkID);
tourRouter.route('/top-5-cheap').get(aliasTopTours, getTours);
tourRouter.route('/stats').get(getTourStat);
tourRouter.route('/monthly-tour/:year').get(getMonthlyTour);
tourRouter.route('/').get(protect, getTours).post(protect, addTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);
tourRouter.use('/:tourId/reviews', reviewRouter);
//tourRouter.route('/:tourId/reviews').post(protect, createReview);
//tourRouter.route('/:tourId/reviews/:reviewId').get(protect, getReview);
module.exports = tourRouter;
