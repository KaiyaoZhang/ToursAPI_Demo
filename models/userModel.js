const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name']
    },
    email: {
        type: String,
        required: [true, 'A user must have a email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'The input is not a validate email format']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'User must fill out passwordConfirm'],
        validate: {
            //this key word only works on create() and save()
            validator: function(val) {
                return val === this.password
            },
            message: 'The passwords you typed in are not the same!'
        }
    },
    passwordChangedAt: Date
});


userSchema.pre('save', async function(next){
    //Only run this if password is modified
    if(!this.isModified('password')) return next();

    //Hash the password with cost 12
    this.password = await bcrypt.hash(this.password, 12);

    //Delete passwordcomfirm field
    this.passwordConfirm = undefined;

    next();
})

//Instance method: is basically a method that gonna be available on all documents of a certain collection
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema)

module.exports = User;