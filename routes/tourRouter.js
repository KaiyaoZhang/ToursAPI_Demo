const express = require('express');
const {
    getTours, 
    createTour, 
    getTour, 
    updateTour, 
    deleteTour,
    aliasTopTours,
    getTourStat,
    getMonthlyTour,
    getToursWithin
} = require( '../controller/tourController');
const {protect, restrictTo} = require('../controller/authController');
const reviewRouter = require('./reviewRouter');
//const {createReview, getReview} = require('../controller/reviewController');
const tourRouter = express.Router();

//tourRouter.param('id', checkID);
tourRouter.route('/top-5-cheap').get(aliasTopTours, getTours);
tourRouter.route('/tour-within/:distance/center/:latlng/unit/:unit').get(getToursWithin);
tourRouter.route('/stats').get(getTourStat);
tourRouter.route('/monthly-tour/:year').get(getMonthlyTour);
tourRouter.route('/').get(getTours).post(protect, createTour);
tourRouter.route('/:id').get(getTour).patch(protect, updateTour).delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);
tourRouter.use('/:tourId/reviews', reviewRouter);

module.exports = tourRouter;
