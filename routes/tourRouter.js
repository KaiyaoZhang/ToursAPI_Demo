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
const tourRouter = express.Router();

//tourRouter.param('id', checkID);
tourRouter.route('/top-5-cheap').get(aliasTopTours, getTours);
tourRouter.route('/stats').get(getTourStat);
tourRouter.route('/monthly-tour/:year').get(getMonthlyTour);
tourRouter.route('/').get(getTours).post(addTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = tourRouter;
