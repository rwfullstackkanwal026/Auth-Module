const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
username: {
    type: String,
    required: [true, 'Please provide username'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    minlength: 2,
    maxlength: 100
},
fullName: {
    type: String,
    required: [true, 'Please provide fullName'],
    trim: true,
    index: true,
    minlength: 2,
    maxlength: 100
},
email: {
    type: String,
    required: [true, 'Please provide email'],
    minlength: 6,
    maxlength: 50,
    trim: true,
    unique: true, //already exists so duplicate error will be thrown
    match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',     ]   
},
password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    maxlength: 100
},
role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
},
refreshToken: {
    type: String
}
},
{ 
    //Automatically adds createdAt and updatedAt on our doc
    timestamps:true
}
)

//hash password
userSchema.pre('save' , async function (){
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password , salt)
})

// generate tokenn
userSchema.methods.createJWT = function (){
    return jwt.sign(
        {
            userId: this._id , name: this.name , role: this.role
        },
        process.env.JWT_SECRET, 
        {
            expiresIn:process.env.JWT_LIFETIME
        }
    )
}


// compare password
userSchema.methods.comparePassword = async function(candidatePassword) // pass entering from user
{
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch

}

// generate Access Token
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//generate Refresh Token
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



module.exports = mongoose.model('User', userSchema)