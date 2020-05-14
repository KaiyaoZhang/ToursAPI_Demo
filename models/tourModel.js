const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a name!'],
        unique: true,
        maxlength: [40, 'A tour must have less than or equal to 40 characters'],
        minlength: [10, 'A tour must have more than or equal to 10 characters']
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration!']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must hava a group size!']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty!'],
        enum: {
            values: ['easy', 'medium', 'difficulty'],
            message: 'Difficulty must be easy, medium, or difficulty'
        }
    },
    ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1'],
        max: [5, 'Rating must be below 5']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                // this key word only points to current doc when new doc creates
                return val < this.price;
            },
            message: 'Discount price cannot be bigger than original price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description!']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image!']
    },
    image: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;