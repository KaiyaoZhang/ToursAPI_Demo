const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');

exports.getReviews = async (req, res, next) => {
    try{
        let filter = {};
        if(req.params.tourId) filter = {tour: req.params.tourId}
        const reviews = await Review.find(filter).select('-__v -id');
        res.status(200).json({
            status: 'success',
            results: reviews.length,
            reviews
        })
    }catch(err){
        next(new AppError(err.message, 400, err))
    }
};

exports.getReview = async (req, res, next) => {
    try{
        const review = await Review.findById(req.params.reviewId);
        res.status(200).json({
            status: 'success',
            review
        })
    }catch(err){
        next(new AppError(err.message, 400, err))
    }
};

exports.createReview = async (req, res, next) => {
    try{
        if(!req.body.tour) req.body.tour = req.params.tourId;
        if(!req.body.user) req.body.user = req.user._id; 
        const checkReview = await Review.findOne({user: req.body.user});
        if(checkReview) {
            return next(new AppError('One user can only create one review', 400, ''));
        }
        const newReview = await Review.create(req.body);
        res.status(201).json({
            status: 'success',
            newReview
        })
    }catch(err){
        next(new AppError(err.message, 400, err)) 
    }
}