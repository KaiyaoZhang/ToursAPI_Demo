const AppError = require('../utils/appError');

exports.deleteOne = Model => {
    return async (req, res, next) => {
        try{
            await Model.findByIdAndDelete(req.params.id);
            res.status(204).json({
                status: 'success',
                data: null
            })
        }catch(err){
            next(new AppError(err.message, 400, err));
        }
    };
};

exports.updateOne = Model => {
    return async (req, res, next) => {
        try{
            const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            })
    
            res.status(200).json({
                status: 'success',
                data: {
                    doc
                }
            })
        }catch(err) {
            next(new AppError(err.message, 404, err));
        }
        
    }
};

exports.createOne = Model => {
    return async (req, res, next) => {
        try{
            let body = {};
            if(req.params.tourId) {
                if(!req.body.tour) req.body.tour = req.params.tourId;
                if(!req.body.user) req.body.user = req.user._id; 
                const checkDoc = await Model.findOne({user: req.body.user, tour: req.body.tour});
                if(checkDoc) {
                    return next(new AppError('One user can only create one review for a tour!', 400, ''));
                }
                body = req.body;
            }else{
                body = req.body;
            }
            const doc = await Model.create(body);
            res.status(201).json({
                status: 'success',
                data: {
                    doc
                }
            })
        }catch(err){
            next(new AppError(err.message, 400, err));
        }
    };
};

exports.getOne = (Model, popOptions) => {
    return async (req, res, next) => {
        try{
          let query = Model.findById(req.params.id).select('-__v');
          if(popOptions) query = query.populate(popOptions);
          const doc = await query;
          if(!doc) {
              return next(new AppError('The information you are looking for desn\'t exist anymore!', 400, ''));
          }
          res.status(200).json({
              status: 'success',
              data: {
                  doc
              }
          })
        }catch(err){
          next(new AppError(err.message, 404, err));
        }
      };
};

exports.getAll = Model => {
    return async (req, res, next) => {
        try{
             let docs = '';
             let filter = {};
             let reviewFilter = {};
             if(req.params.tourId) reviewFilter = {tour: req.params.tourId}
             const queryObj = {...req.query};
             //Filtering
             const excludedFields = ['page', 'sort', 'limit', 'fields'];
             excludedFields.forEach(el => delete queryObj[el]);
             const queryStr = JSON.stringify(queryObj);
             const queryStr2 = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
             const queryObj2 = JSON.parse(queryStr2);
             filter = {...queryObj2, ...reviewFilter};
             let query = Model.find(filter);
     
             //Sorting 
             if(req.query.sort){
                 console.log(req.query.sort);
                 const sortBy = req.query.sort.split(',').join(' ');
                 console.log(sortBy);
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
             const limit = req.query.limit * 1 || 100;
             const skip = (page - 1) * limit;
     
             const numDocs = await Model.countDocuments();
             if(skip >= numDocs) throw new Error('This page does not exit!');
     
             query = query.skip(skip).limit(limit);
     
             docs = await query;
             res.status(200).json({
                 status: 'success',
                 headers: req.headers,
                 length: docs.length,
                 data: {
                    docs
                 }
             });
        }catch(err) {
             next(new AppError(err.message, 404, err));
        }
         
     };
}