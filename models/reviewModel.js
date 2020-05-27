const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        trim: true,
        required: [true, 'Missing review!']
    },
    rating: {
        type: Number,
        required: [true, 'A review must have a rating'],
        min: [1, 'Rating must be above 1'],
        max: [5, 'Rating must be below 5']
    },
    user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user']
    },
    tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must belong to a tour']
        }
    }, 
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
        id: false
    }
);

reviewSchema.pre(/^find/, async function(next){
    this
    .populate({path: 'user', select: 'name'})
    .populate({path: 'tour', select: 'name -guides'});
    
    next();
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;