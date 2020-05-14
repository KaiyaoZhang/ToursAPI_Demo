//const fs = require('fs');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
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
 }

 exports.getTours = async (req, res, next) => {
   try{
        let tours = '';
        const queryObj = {...req.query};
        //Filtering
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        const queryStr = JSON.stringify(queryObj);
        const queryStr2 = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        const queryObj2 = JSON.parse(queryStr2);
        let query = Tour.find(queryObj2);

        //Sorting 
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('-createdAt');
        }
        
        //Field Limiting
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            qury = query.select(fields);
        }else{
            query = query.select('-__v');
        }

        //Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 10;
        const skip = (page - 1) * limit;

        const numTours = await Tour.countDocuments();
        if(skip >= numTours) throw new Error('This page does not exit!');

        query = query.skip(skip).limit(limit);

        tours = await query;
        res.status(200).json({
            status: 'success',
            length: tours.length,
            data: {
                Tours: tours
            }
        });
   }catch(err) {
        // res.status(404).json({
        //     status: 'fail',
        //     error: 'No data!'
        // })
        next(new AppError(err.message, 404, err));
   }
    
}

exports.getTour = async (req, res, next) => {
  try{
    const tour = await Tour.findById(req.params.id);
    
    res.status(200).json({
        status: 'success',
        Tour: tour
    })
  }catch(err){
    // res.status(404).json({
    //     status: 'fail',
    //     error: err
    // })
    next(new AppError(err.message, 404, err));
  }
}


exports.addTour = async (req, res, next) => {
    try{
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                createdTour: newTour
            }
        })
    }catch(err){
        // res.status(400).json({
        //     status: 'fail',
        //     error: 'Invalid data sent!'
        // })
        next(new AppError(err.message, 400, err));
    }
    

}

exports.updateTour = async (req, res, next) => {
    try{
        const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: {
                updatedTour: newTour
            }
        })
    }catch(err) {
        // res.status(404).json({
        //     status: 'fail',
        //     error: err
        // })
        next(new AppError(err.message, 404, err));
    }
    
}

exports.deleteTour = async (req, res) => {
    try{
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        })
    }catch(err){
        // res.status(400).json({
        //     status: 'fail',
        //     err: err
        // })
        next(new AppError(err.message, 400, err));
    }
};

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
