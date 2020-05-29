const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const {deleteOne, updateOne, createOne, getOne, getAll} = require('./factoryController');
//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

/*  exports.checkID = (req, res, next) => {
    const id = req.params.id * 1;
    if(id > tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    next();
} 

exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price){
        return res.status(400).json({
            status: 'fail',
            message: 'Bad request!'
        })
    }
    
    next();
}
 */

 exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';

    next();
 };

 exports.getTours = getAll(Tour);

exports.getTour = getOne(Tour, {path: 'reviews', select: 'review rating -tour'});

exports.createTour = createOne(Tour);

exports.updateTour = updateOne(Tour);

exports.deleteTour = deleteOne(Tour);

exports.getTourStat = async (req, res) => {
    try{
        const stats = await Tour.aggregate([
            {$match: { ratingsAverage: { $gte: 4.5 } }},
            {$group: { 
                _id: '$duration',
                numTour: {$sum: 1},
                numRatings: {$sum: '$ratingsQuantity'},
                avgRating: {$avg: '$ratingsAverage'},
                avgPrice: {$avg: '$price'},
                minPrice: {$min: '$price'},
                maxPrice: {$max: '$price'}
            }},
            {$sort: {avgPrice: 1}}
        ])

        res.status(200).json({
            status: 'success',
            data: stats
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            err: err
        })
    }
};

exports.getMonthlyTour = async (req, res) => {
    try{
        const year = req.params.year;

        const monthlyTours = await Tour.aggregate([
            {$unwind: '$startDates'},
            {$match: {startDates: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            }}},
            {$group: {
                _id: {$month: '$startDates'},
                numTours: {$sum: 1},
                tours: {$push: '$name'}
            }},
            {$addFields: { month: '$_id' }},
            {$project: { _id : 0 }},
            {$sort: {numTours: -1}}
        ])

        res.status(200).json({
            status: 'success',
            data: monthlyTours
        })
    }catch(err) {
        res.status(404).json({
            status: 'fail',
            err: err
        })
    }
}
