const mongoose = require('mongoose');
const round = require('mongo-round');
const Tour = require('./tourModel');

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

reviewSchema.statics.calcRatings = async function(tourId){
    //this keyword points to current model
   const stat = await this.aggregate([
        {$match: { tour: tourId }},
        {$group: {
            _id: '$tour',
            nRatings: {$sum: 1},
            avgRating: {$avg: '$rating'}
        }},
        {$addFields: { avgRating: round('$avgRating', 2) }}
    ])

    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stat[0].nRatings,
        ratingsAverage: stat[0].avgRating
    });
};

reviewSchema.post('save', function(){
    //this points to the current document, this.constructor points to the current model.
    this.constructor.calcRatings(this.tour);
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;