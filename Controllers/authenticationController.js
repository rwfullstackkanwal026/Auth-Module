const User = require('../Models/user')
const { StatusCodes } = require('http-status-codes');
const {BadRequestError, UnauthenticatedError , CustomAPIError} = require('../Errors ')



const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken

    //save token into DB
    await user.save({validateBeforeSave: false})

    return {accessToken , refreshToken}




  } catch (error) {
    throw new CustomAPIError("Something went wrong while generating refresh and access token")
  }
}

const register = async (req, res ) =>{

    const user = await User.create({...req.body})

    const token = user.createJWT()

    res.status(StatusCodes.CREATED).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  });
}



const login = async (req,res ) =>{
    const {email, username, password} = req.body
    
    if(!email || !username || !password){
        throw new BadRequestError("Please Provide email and password")
    }

    // const user = await User.findOne({ email });
    const user = await User.findOne({ 
      $or: [{username}, {email}]
    });

    if(!user){
        throw new UnauthenticatedError("Invalid credentials")
    }

    //comapre pass
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Invalid credentials")
    }

    const {accessToken, refreshToken} = await 
    generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken") // fields not needed
    
    res.status(StatusCodes.CREATED).json({
    message: 'Login successful',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  });
}


module.exports = {
    register,
    login
}